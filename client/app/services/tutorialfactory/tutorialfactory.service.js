'use strict';

angular.module('ariadneApp')
  .factory('tutorialFactory', function ($modal, localStorageService) {

    var tutorials = {
      intro: {
        name: null,
        stages:{
          main: null
        }
      },
      bokoharam: {
        title: 'Fighting Boko Haram',
        url: '/assets/sample_data/bokoharam.json',
        image: '/assets/images/bokoharam.jpg',
        order: 1,
        stages:{
          start:{
            header: 'Fighting Boko Haram',
            text: '<div class=\"pull-left col-lg-4 col-md-4 col-sm-4 col-xs-4\"><img src=\"/assets/images/tutorialbokoharam.jpg\" class=\"img-responsive img-circle\"></div><strong>You are an intelligence analyst from Chad monitoring combat against Boko Haram, the radical militia.</strong><br><br>Your intelligence collection system is often unreliable, so many critical pieces of information come from the news media. Recently, there has been talk of Boko Haram allying with the Islamic State. Your goal today is to understand the latest troop movements and Boko Haram\'s key political connections.<br><br><h4>Getting Started</h4>Your sources have been automatically populated with a news search of \"Boko Haram\" from March 12, 2015. <br><strong>When you\'re done reviewing the documents, press Analyze and select a view.</strong><br><br><i>(To see the tutorial any time, select the question mark in the bottom right hand corner.)</i>'
          },
          map: {
            header: 'Mapping Combat',
            text: 'The map view allows you to plot locations mentioned in your documents. This is especially valuable when events with regional implications such as violence or disease outbreaks.<br><h4>Challenges</h4><ul><li>Where is violence occurring in Nigeria?</li><li>Who controls which area?</li><li>Who is gaining ground?</li><li>What other geographic regions are affected? How?</li>'
          },
          timeline: {
            header: 'A History of Boko Haram',
            text:'The timeline view extracts dates from source texts and plots events. Relative dates (such as \"this Friday\") are identified using the document\'s publication date as a frame of reference. The timeline view is useful in understanding how events affect each other over time and identifying the patterns that occur.<br><br><h4>Challenges</h4><ul><li>What happened between 2012 and 2013 to Ansaru?</li><li>What were some of the events prior to Boko Haram pledging allegience to ISIS?</li>'
          },
          graph: {
            header: 'A Who\'s Who of Radical Islamists',
            text:'<h4>Challenges</h4><ul><li>Who is al-Baghdadi?</li><li>What is Boko Haram’s relationship to Abu Bakr al-Baghdadi?</li><li>What is Boko Haram\'s relationship to ISIS?</li>'
          },
        }
      },
      measles: {
        title: 'Tracking Measles',
        url: '/assets/sample_data/measles.json',
        image: '/assets/images/measles.jpg',
        order: 2,
        stages:{
          start:{
            header: 'Tracking Measles',
            text: '<div class=\"pull-left col-lg-4 col-md-4 col-sm-4 col-xs-4\"><img src=\"/assets/images/tutorialmeasles.jpg\" class=\"img-responsive img-circle\"></div><strong>You are an epidemiologist with the Centers of Disease Control.</strong><br><br>Due to a mix of factors, including declining vaccination rates and several significant outbreaks, measles has begun a dangerous resurgence. Every morning, you\'re tasked with providing a summary update on new reported cases and public sentiment. Today, you are interested in investigating global cases, and you are particularly interested in reports of high risk in West Africa.<br><br><h4>Getting Started</h4>Your sources have been automatically populated with a news search of \"measles outbreak\" from March 11, 2015. <br><strong>When you\'re done reviewing the documents, press Analyze and select a view.</strong><br><br><i>(To see the tutorial any time, select the question mark in the bottom right hand corner.)</i>'
          },
          map: {
            header: 'The Outbreak Battleground',
            text: 'The map view allows you to plot locations mentioned in your documents. This is especially valuable when events with regional implications such as violence or disease outbreaks.<br><h4>Challenges</h4><ul><li>What US state is showing the most widespread outbreak?</li><li>What is the infection rate in Quebec?</li><li>Why is measles affecting Western Africa?</li></ul>'
          },
          timeline: {
            header: 'A Disease Across Generations',
            text:'The timeline view extracts dates from source texts and plots events. Relative dates (such as \"this Friday\") are identified using the document\'s publication date as a frame of reference. The timeline view is useful in understanding how events affect each other over time and identifying the patterns that occur.<br><br><h4>Challenges</h4><ul><li>What were the major early benchmarks of the measles vaccine?</li><li>What was the earliest reported measles elimination in the United States?</li></ul>'
          },
        }
      },
      alqaeda: {
        title: 'Reports on a Terrorist Trial',
        url: '/assets/sample_data/alqaeda.json',
        image: '/assets/images/alqaeda.jpg',
        order:3,
        stages:{
          start:{
            header: 'Reports on a Terrorist Trial',
            text: '<div class=\"pull-left col-lg-4 col-md-4 col-sm-4 col-xs-4\"><img src=\"/assets/images/tutorialreporter.jpg\" class=\"img-responsive img-circle\"></div><strong>You are a journalist covering the Middle East for a major online publication.</strong><br><br>As a source of online news, your success is highly dependent on how fast you can react to new stories. At the same time, you need to main the quality of your reporting, and to do that, you need to understand the context and importance of events. Today, you are interested in the upcoming trials of several terrorists in the context of the broader conflict.<br><br><h4>Getting Started</h4>Your sources have been automatically populated from a news search of \"al Qaeda\" from March 13, 2015. <br><strong>When you\'re done reviewing the documents, press Analyze and select a view</strong>.<br><br><i>(To see the tutorial any time, select the question mark in the bottom right hand corner.)</i>'
          },
          map: {
            header: 'Global Terrorism',
            text: 'TThe map view allows you to plot locations mentioned in your documents. This is especially valuable when events with regional implications such as violence or disease outbreaks.<br><h4>Challenges</h4><ul><li>Who was kidnapped from Yemen?</li></ul>'
          },
          timeline: {
            header: 'Retracing Their Steps',
            text:'The timeline view extracts dates from source texts and plots events. Relative dates (such as \"this Friday\") are identified using the document\'s publication date as a frame of reference. The timeline view is useful in understanding how events affect each other over time and identifying the patterns that occur.<br><br><h4>Challenges</h4><ul><li>Why was 2011 important for both Abid Naseer and Minh Quang Pham?</li></ul>'
          },
          graph: {
            header: 'A Tangled Web',
            text: '<h4>Challenges</h4><ul><li>What is Naseer’s connection with Khalid al-Fawwaz?</li></ul>'
          },
        }
      },
      china: {
        title: 'China Searches Wikileaks',
        url: '/assets/sample_data/china.json',
        image: '/assets/images/china.jpg',
        order:4,
        stages:{
          start:{
            header: 'China Searches Wikileaks',
            text: 'This is a search for Nasser.'
          },
          map: {
            header: 'Global Terrorism',
            text: 'Who was kidnapped from Yemen?'
          },
          timeline: {
            header: 'Retracing Their Steps',
            text:'Why was 2011 important for both Abid Naseer and Minh Quang Pham?'
          },
          graph: {
            header: 'A Tangled Web',
            text: 'What is Naseer’s connection with Khalid al-Fawwaz?'
          },
        }
      },

    }

    var localData = localStorageService.get('myTutorials')
    var myTutorials;

    if(localData){
      myTutorials = localData
    } else {
      myTutorials = {
        intro: {
          stages: {
          }
        }
      }
    }


    var store = function(){
      localStorageService.set('myTutorials', myTutorials)
    }

    var currentTutorial = null;

    var getTutorial = function(tutorial, page){
      tutorials[tutorial].stages[page];
    }

    var showIntro = function () {
       var modalInstance = $modal.open({
         templateUrl: '../components/intromodal/intromodal.html',
         controller: 'IntroModalInstanceCtrl',
         size: 'md',
         backdrop: true,
      });

       modalInstance.result.then(function (data) {
         myTutorials.intro.complete = true;
         console.log('completed')
       }, function () {
         console.log('Modal dismissed at: ' + new Date());
       })
     }

    var demo = function (page, review) {
      if(currentTutorial){
        if(typeof tutorials[currentTutorial].stages[page] !== 'undefined'){
          if(typeof myTutorials[currentTutorial] == 'undefined'){
            myTutorials[currentTutorial] = {
              stages: {}
            }
          }
          if(typeof myTutorials[currentTutorial].stages[page] == 'undefined'){
            myTutorials[currentTutorial].stages[page] = {
              completed: false
            }
          }
          if(tutorials[currentTutorial].stages[page] && !myTutorials[currentTutorial].stages[page].complete || review){
              var modalInstance = $modal.open({
                templateUrl: '../components/tutorialmodal/tutorialmodal.html',
                controller: 'TutorialModalInstanceCtrl',
                size: 'lg',
                backdrop: true,
                resolve: {
                  tutorial: function () {
                    return tutorials[currentTutorial].stages[page];
                  }
                }
            });


               modalInstance.result.then(function (data) {
               }, function () {
                 console.log('Modal dismissed at: ' + new Date());
               });
          }
        }
      }
    };

    // Public API here
    return {
      intro: function () {
        if(!myTutorials.intro.complete){
          showIntro();
        }
      },
      setDemo: function(demo){
        currentTutorial = demo;
      },
      demo: function(page, review){
        demo(page, review)
      },
      getTutorials: function(){
        var demos = tutorials;
        delete demos.intro
        return demos;
      },
      toggleTutorial: function(tutorial, status){
        // Unused
        if(typeof status !== 'undefined'){
          myTutorials[tutorial].show = status;
        } else {
          myTutorials[tutorial].show = !myTutorials[tutorial].show
        }
        store();
      },
      updateTutorial: function(tutorial, page){
        if(typeof myTutorials[tutorial] == 'undefined'){
          myTutorials[tutorial] = {
            stages: {}
          };
        }
        if(typeof myTutorials[tutorial].stages[page] == 'undefined'){
          myTutorials[tutorial].stages[page] = {
            complete: true
          }
        } else {
          myTutorials[tutorial].stages[page].complete = true
        }
        var incomplete = false;
        angular.forEach(myTutorials[tutorial].stages, function(stage, sKey){
          if (!stage.complete){
            incomplete = true;
          }
        })
        if(!incomplete){
          myTutorials[tutorial].complete = true;
        }
        store();
      }
    };
  });
