const config = {
    initialRouteName: 'DrawerNavigationRoutes',
    screens: {
        ExclusiveNewsScreen: '/exclusiveNewsScreen',
        NewsDetailsScreen: {
         path: "news-details-screen/:itemId",
         parse: {
           itemId: (itemId) => `${itemId}`,
                },
        },
        // News: {
        //     path: "news/:itemId",
        //     parse: {
        //       itemId: (itemId) => `${itemId}`,
        //            },
        //    },
        //  NewsDetailsScreen: '/newsdetailsscreen/:itemId',
         //  NewsDetailsScreen: {
         //   path: '/newsdetailsscreen/:itemId',
         //   parse:{
         //     itemId: (itemId) => `${itemId}`
         //   },
         // exact: true,
         // },
          SettingsScreen: "/settingsScreen",
         },
};
const linking = {
    // prefixes: [ 'rawnews://'],
    // prefixes: [ 'https://com.rawnewsusa.app//'],
    // prefixes: [ 'https://bluebookblacknews.com'],
     prefixes: ["https://rawnewsusa.com", 'rawnews://'],
     config,
     };

export default linking;