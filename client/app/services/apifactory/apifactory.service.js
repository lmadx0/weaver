'use strict';

angular.module('ariadneApp')
  .factory('apiFactory', function ($q, $http, $filter, $timeout) {
    // Service logic
    var boilerplate = {
      "events" : {
        "hash" : {
          "mentions" : [ {
            "mentref" : "-E48",
            "set" : "hash"
          } ],
          "name" : "War",
          "traits" : {
            "time" : "February 2002"
          }
        }
      },
      entities_test: {
        entity_uid: {
          refs: [
            {
              batch: "batch_uid",
              eid: "-E12"
            },
            {
              batch: "batch_uid",
              eid: "-E11"
            }
          ]
        }
      },
      entities: {
      },
      mentions:{},
      relations:{},
      social:{
        twitter:{

        }
      },
      index: {
        batch_uid:{
          entities:{
            eid: 'uid'
          }
        }
      },
      "sources_example" : {
        //"uid" : {
          "analysis" : {
            "relationships" : "relationshipdata",
            originals: {
              "relationships": "relationshipdatapure"
            },
          },

          "docs":[{
            "text" : "text here",
            "title" : "title here",
            "type" : "text"
          }]

      //  }
      },
      sources: {
        analysis:{},
        docs:[]
      }
    }

    var db = boilerplate;

    var rebuild = function(){
      var entities = db.entities
      angular.forEach(entities, function(entity, eKey){
        var refs = entity.refs;
        for (i = 0; i < refs.length; i++) {
          if (i = 0){
            refs[i]
          }
        }
      })
    }



    var parseDate = function(text, ref, type){
    }

    var docIndex = function(mid){
      console.log('docindex')
      console.log(db)
      var docInd;
      var start = db.mentions[mid].begin;
      var doc = db.sources.docs;
      console.log(doc)
      for (var i = 0; i < doc.length; i++) {
        console.log(i)
        console.log(doc[i])
        if(doc[i].start <= start && doc[i].end >= start){
          docInd = i
        }
      }
      console.log(docInd)
      return docInd;
    }

    var docsIndex = [];

    var mentionIndex = function(data){
      var text = '';
      console.log(data)
      var relationships = data.sources.analysis.relationships
      text = relationships.rep.doc[0].text[0];
      var distance = 100;
      var mentions = relationships.rep.doc[0].mentions[0].mention;
      angular.forEach(mentions, function(mention, key){
        var pre = text.substring((mention.$.begin*1 - distance), mention.$.begin*1);
        var term = text.substring(mention.$.begin*1, mention.$.end*1 + 1);
        var post = text.substring(mention.$.end*1 + 1, mention.$.end*1 + distance);
        db.mentions[mention.$.mid] = mention.$.mid;
        db.mentions[mention.$.mid] = {
          begin: mention.$.begin*1,
          end: mention.$.end*1,
          snippets: {
            pre: pre,
            term: term,
            post: post
          },
        }
      })
    }






    // Public API here
    return {
      post: function (data, path) {
        db.push(data);
        return 'Success';
      },
      get: function () {
        var deferred = $q.defer();
        var retrieve = function(){
          deferred.resolve(db)
        }
        retrieve();
        return deferred.promise;
      },
      getSources: function () {
        var deferred = $q.defer();
        var retrieve = function(){
          deferred.resolve(db.sources)
        }
        retrieve();
        return deferred.promise;
      },
      updateEntity: function (data, key) {
        console.log(db)
        db.entities[key] = data;
        return db.entities[key];
      },
      getEntities: function () {
        var deferred = $q.defer();
        var retrieve = function(){
          deferred.resolve(db.entities)
        }
        retrieve();
        return deferred.promise;
      },
      addSource: function (postData) {
        db = boilerplate;
        var deferred = $q.defer();
        var concatenated = "";
        var concatPosition = 0;
        var saved = {
          analysis: {},
          created: new Date(),
          docs: [],
        }

        angular.forEach(postData, function(post, pKey){
          concatenated = concatenated.concat(post.text + " ");
          post.start = concatPosition;
          post.end = concatPosition + post.text.length;
          concatPosition = concatPosition + concatenated.length + 2
          saved.docs.push(post)
        });
        var header = {
            sid: 'ie-en-news',
            rt: 'xml',
            txt: concatenated,
        }
        console.log(header.txt)
        $http.post('/api/watson/relationships', header).success(function(data) {
        // Dummy data
        //$http.get('/app/dummy.json').success(function(data)
          console.log(data)
          saved.analysis.relationships = data;
          // Reinstate timestamp when multiple analyses available
          // var timestamp = Date.now()
          db.sources = saved;
          var entities = data.rep.doc[0].entities[0].entity;
          var relations = data.rep.doc[0].relations[0].relation;
          db.sents = data.rep.doc[0].sents[0].sent;

          mentionIndex(db);

          angular.forEach(entities, function(entity, key){
            db.entities[entity.$.eid] = entity
            // If date, parse using Chrono
            if (entity.$.type == "DATE"){
              var ref = null;
              var mid = entity.mentref[0].$.mid
              var docNum = docIndex(mid);
              // Retrieve document reference date
              if (docNum){
                if (typeof saved.docs[docNum].date !== 'undefined'){
                  ref = new Date(saved.docs[docNum].date);
                }
              }
              var header = {
                text: entity.mentref[0]._,
                ref: ref
              }
              $http.post('/api/chrono/parse', header).success(function(data) {
                console.log('chrono ')
                console.log(data)
                entity.date = data
              })
            }
          })
          // Attach relations to entities
          angular.forEach(relations, function(relation, key){
            db.relations[relation.$.rid] = relation;
            // If no relations tagged to entity, create array
            if (!db.entities[relation.rel_entity_arg[0].$.eid].relations){
              db.entities[relation.rel_entity_arg[0].$.eid].relations = [];
            }
            if (!db.entities[relation.rel_entity_arg[1].$.eid].relations){
              db.entities[relation.rel_entity_arg[1].$.eid].relations = [];
            }

            var source = relation.$;
            var target = relation.$;

            source.role = 'source'
            target.role = 'target'

            // Attach relation to source entity
            db.entities[relation.rel_entity_arg[0].$.eid].relations.push(source)

            // Attach relation to target entity
            db.entities[relation.rel_entity_arg[1].$.eid].relations.push(target)
          })

          for (var i = 0; i < db.sents.length; i++){
            for (var j = 0; j < db.sources.docs.length; j++){
              if(db.sents[i].tokens[0].token[0].$.begin >= db.sources.docs[j].start && db.sents[i].tokens[0].token[0].$.begin < db.sources.docs[j].end){
                db.sents[i].docId = j;
              }
            }
          }


          deferred.resolve(db)
        });
        return deferred.promise;
      },
      parseDate: function (text, ref, type) {
        var deferred = $q.defer();
        var header = {
          text: text,
          ref: ref
        }
        if(type=='full'){
          $http.post('/api/chrono/parse', header).success(function(data) {
            deferred.resolve(data);
          })
        } else {
          $http.post('/api/chrono/date', header).success(function(data) {
            deferred.resolve(data);
          })
        }
        return deferred.promise;
      },
      getUrl: function (url) {
        var deferred = $q.defer();
        $http({
            url: ('/api/unfluff'),
            method: "GET",
            params: {url: url}
         }).success(function(data) {
           console.log(data)
          deferred.resolve(data);
        })
        return deferred.promise;
      },
      getTwitterUser: function (screenname) {
        var deferred = $q.defer();
        $http({
            url: ('/api/twitter/user'),
            method: "GET",
            params: {screen_name: screenname}
         }).success(function(data) {
          db.social.twitter[screenname] = data;
          deferred.resolve(data);
        })
        return deferred.promise;
      },
      getNews: function (params, api) {
        var deferred = $q.defer();
        var url;
        if(api == 'webhose'){
          url = '/api/webhose'
        } else {
          url = '/api/yahoo/news'
        }
        $http({
            url: url,
            method: "GET",
            params: params,
         }).success(function(results) {
           var docs = [];
           var proms = [];
           if(api == 'webhose'){
             angular.forEach(results.posts, function(result, rKey){
               var title;
               if (result.title.length > 0){
                 title = result.title;
               } else {
                 title = result.thread.title;
               }
               var pushed = {
                 text: result.text,
                 title: title,
                 date: result.published,
               };
               docs.push(pushed)
             })
             deferred.resolve(docs);

           } else if (api == 'yahoo'){
             var urls = []
             console.log(results)
             for (var i = 0; i < results.length; i++){
               urls.push(results[i].url);
             }
              $http({
                 url: ('/api/unfluff'),
                 method: "GET",
                 params: {url: urls}
              }).success(function(data) {
                console.log(data)
                var offset = 0;
                for (var i = 0; i < data.length; i++){
                  console.log(data);
                  if (data[i]){
                    var pushed = data[i];
                    pushed.title = results[i].title;
                    pushed.source = results[i].source;
                    pushed.date = results[i].date;
                    console.log(pushed);
                    docs.push(pushed);
                  } else {
                    offset +=1;
                  }
                  if (docs.length == data.length - offset){
                    deferred.resolve(docs);
                  }
                }
             })
           }
        })
        return deferred.promise;
      },
      idDoc: function (mid) {
        docIndex(mid);
      },
      getSnippet: function (mid, buffer) {
        var deferred = $q.defer();
        var begin = db.mentions[mid].begin;
        console.log('begin: ' + begin)
        var end = db.mentions[mid].end;
        console.log('end: ' + end)

        var targetDocIndex = docIndex(mid);
        var text = db.sources.analysis.relationships.rep.doc[0].text[0];
        var term = text.slice(begin*1, end*1+1);
        var pre = '';
        var post = '';
        var phrase = '';
        var preFound = false;
        var postFound = false;
        var sents = db.sents;
        var sid;
        var sidBackup;
        // Find correct sent
        for (var i = 0; i < sents.length; i++){
          console.log('sent checked: ' + i)
          console.log(sents[i])
          if(sents[i].tokens[0].token[0].$.begin <= begin){
            if(sents[i].tokens[0].token[0].$.end > end){
              sid = i;
            }
          } else {
            if(!sidBackup){
              sidBackup = i-1;
            }
          }
        }
        // If no sid identified, use the backup when it switched
        if(!sid){
          sid = sidBackup;
        }
        console.log('sid: ' + sid)
        console.log(sents[sid].docId)
        if(sents[sid+1]){
          phrase = text.slice(sents[sid].tokens[0].token[0].$.begin*1, sents[sid+1].tokens[0].token[0].$.begin*1-1)
        }
        // Find buffer sentences
        for (var i = buffer; i > 0; i--){
          console.log('buffer check ' + i);
          console.log('targetdocindex: ' + targetDocIndex)
          if((sid-i) > 0 && sents[sid-i].docId == targetDocIndex && !preFound){
            console.log('pre found!')
            console.log('pre start: ' + sents[sid-i].tokens[0].token[0].$.begin*1)
            console.log('pre end: ' + begin)
            pre = text.slice(sents[sid-i].tokens[0].token[0].$.begin*1, (begin*1));
            preFound = true;
          }
          if(sents[sid+i] && !postFound){
            if(sents[sid+i].docId == targetDocIndex){
              console.log('post found!')
              console.log('post start: ' + end)
              console.log('post end: ' + sents[sid+i].tokens[0].token[0].$.end)
              var postEnd;
              if(sents[sid+i+1]){
                postEnd = sents[sid+i+1].tokens[0].token[0].$.end*1
              } else {
                postEnd = null;
              }
              post = text.slice((end*1)+1, postEnd);

              postFound = true;
            }
          }
          console.log('done')
        }

        if (!pre){
          pre = text.slice(sents[sid].tokens[0].token[0].$.begin,begin);
        }
        if(!post){
          post = text.slice(end)
        }
        var postData = {
          pre: pre,
          post: post,
          term: term,
          phrase: phrase
        }
        deferred.resolve(postData);

        return deferred.promise;
      },
    };
  });
