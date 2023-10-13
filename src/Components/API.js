import React, { Component } from 'react';

export default class API extends Component {

    constructor(props) {
        super(props);

        const obj = this;    
        const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v2/files/';    

        var options = props;

        var noop = function() {};
        this.file = options.file;
        this.contentType = options.contentType || this.file.type || 'application/octet-stream';
        this.metadata = options.metadata || {
            'title': this.file.name,
            'mimeType': this.contentType
        };
        this.token = options.token;
        this.onComplete = options.onComplete || noop;
        this.onProgress = options.onProgress || noop;
        this.onError = options.onError || noop;
        this.offset = options.offset || 0;
        this.chunkSize = options.chunkSize || 0;
        //this.retryHandler = new RetryHandler();
        this.retryHandler = new obj.RetryHandler();

        this.url = options.url;
        if (!this.url) {
            var params = options.params || {};
            params.uploadType = 'resumable';
            //this.url = this.buildUrl_(options.fileId, params, options.baseUrl);
            this.url = obj.buildUrl_(options.fileId, params, options.baseUrl);
        }
        this.httpMethod = options.fileId ? 'PUT' : 'POST';    
    }

    RetryHandler = function() {
        this.interval = 1000; // Start at one second
        this.maxInterval = 60 * 1000; // Don't wait longer than a minute 
    };

    retry = function(fn) {
        setTimeout(fn, this.interval);
        this.interval = this.nextInterval_();
    };

    reset = function() {
        this.interval = 1000;
    };

    nextInterval_ = function() {
        var interval = this.interval * 2 + this.getRandomInt_(0, 1000);
        return Math.min(interval, this.maxInterval);
    };

    getRandomInt_ = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    buildQuery_ = function(params) {
        params = params || {};
        return Object.keys(params).map(function(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');
    };

    buildUrl_ = function(id, params, baseUrl) {
        var url = baseUrl || DRIVE_UPLOAD_URL;
        if (id) {
            url += id;
        }
        var query = this.buildQuery_(params);
        if (query) {
            url += '?' + query;
        }
        return url;
    }; 

    upload = function() {
        //var self = this;
        var xhr = new XMLHttpRequest();  
        xhr.open(this.httpMethod, this.url, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + this.token);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('X-Upload-Content-Length', this.file.size);
        xhr.setRequestHeader('X-Upload-Content-Type', this.contentType);
    
        xhr.onload = function(e) {
            if (e.target.status < 400) {
            var location = e.target.getResponseHeader('Location');
            this.url = location;
            this.sendFile_();
            } else {
            this.onUploadError_(e);
            }
        }.bind(this);
        xhr.onerror = this.onUploadError_.bind(this);
        xhr.send(JSON.stringify(this.metadata));
    };

    sendFile_ = function() {
        var content = this.file;
        console.log(content);
        var end = this.file.size;
    
        if (this.offset || this.chunkSize) {
            // Only bother to slice the file if we're either resuming or uploading in chunks
            if (this.chunkSize) {
            end = Math.min(this.offset + this.chunkSize, this.file.size);
            }
            content = content.slice(this.offset, end);
            console.log(content);
        }
    
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', this.url, true);
        xhr.setRequestHeader('Content-Type', this.contentType);
        xhr.setRequestHeader('Content-Range', 'bytes ' + this.offset + '-' + (end - 1) + '/' + this.file.size);
        xhr.setRequestHeader('X-Upload-Content-Type', this.file.type);
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', this.onProgress);
        }
        xhr.onload = this.onContentUploadSuccess_.bind(this);
        xhr.onerror = this.onContentUploadError_.bind(this);
        xhr.send(content);
        console.log(content);
    };

    resume_ = function() {
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', this.url, true);
        xhr.setRequestHeader('Content-Range', 'bytes */' + this.file.size);
        xhr.setRequestHeader('X-Upload-Content-Type', this.file.type);
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', this.onProgress);
        }
        xhr.onload = this.onContentUploadSuccess_.bind(this);
        xhr.onerror = this.onContentUploadError_.bind(this);
        xhr.send();
    };

    extractRange_ = function(xhr) {
        var range = xhr.getResponseHeader('Range');
        if (range) {
            this.offset = parseInt(range.match(/\d+/g).pop(), 10) + 1;
        }
    };

    onContentUploadSuccess_ = function(e) {
        if (e.target.status == 200 || e.target.status == 201) {
            this.onComplete(e.target.response);
        } else if (e.target.status == 308) {
            this.extractRange_(e.target);
            this.reset();
            this.sendFile_();
        }
    };

    onContentUploadError_ = function(e) {
        if (e.target.status && e.target.status < 500) {
            this.onError(e.target.response);
        } else {
            this.retry(this.resume_.bind(this));
        }
    };

    onUploadError_ = function(e) {
        this.onError(e.target.response); // TODO - Retries for initial upload
    };

}