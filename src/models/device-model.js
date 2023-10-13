class Device {
  constructor(imeiNumber, type, validity, active, allowedAt) {
    (this.imeiNumber = imeiNumber),
      (this.type = type),
      (this.validity = validity),
      (this.active = active),
      (this.allowedAt = allowedAt);
  }
}
