'use strict';

angular.module('ariadneApp')
  .factory('d3Factory', function ($q) {
    // Service logic

    var svg;
    var node;

    var setForce = function(entities, links){

      var graphData = {
        nodes: [],
        links: []
      };
      var entityKey = {};
      var entityInt = 0;
      angular.forEach(entities, function(entity, key){
        var pushed = {
          name: entity.mentref[0]._,
          group: entity.$.type
        }
        entityKey[entity.$.eid] = entityInt;
        entityInt += 1;
        graphData['nodes'].push(pushed);
      });
      angular.forEach(links, function(link, key){
        if (typeof entityKey[link.rel_entity_arg[0].$.eid] !== 'undefined' && typeof entityKey[link.rel_entity_arg[1].$.eid] !== 'undefined'){
          var pushed = {
            source: entityKey[link.rel_entity_arg[0].$.eid],
            target: entityKey[link.rel_entity_arg[1].$.eid],
            value: link.relmentions[0].relmention[0].$.score
          }
          graphData['links'].push(pushed);
        }
      })

        console.log('graphData')
        console.log(graphData)

        var width = 800,
            height = 700

        svg = d3.select("#canvas").append("svg")
            .attr("width", width)
            .attr("height", height);

        var force = d3.layout.force()
            .gravity(.1)
            .distance(75)
            .charge(-100)
            .size([width, height]);

        force
            .nodes(graphData.nodes)
            .links(graphData.links)
            .start();

        var link = svg.selectAll(".link")
            .data(graphData.links)
          .enter().append("line")
            .attr("class", "link");

        node = svg.selectAll(".node")
            .data(graphData.nodes)
          .enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        link.style("stroke-width", 2)
            .style("fill", "#AAAAAA")
            .on("mouseover", function(d){
              var linkSelection = d3.select(this).style("stroke-width", 4)
              .on('mouseout', function(d) { linkSelection.style('stroke-width', 2); })
            })


        node.append("svg:circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 5)
            .style("fill", "#AAAAAA")
            .on("mouseover", function(d){
              var nodeSelection = d3.select(this).style("fill", "#009793")
              .on('mouseout', function(d) { nodeSelection.style("fill", "#AAAAAA"); })
            })

        node.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) {
              var textSelection = d3.select(this).style("fill", "#AAAAAA")
              return d.name;
            });

        force.on("tick", function() {
          link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });

          node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });

    }

    var updateForce = function(type){
      console.log('filled')
      var filtered = node.filter(function(d) {
        return d.group == type;
      })
      filtered.selectAll("circle")
        .attr("r",8)
        .style("fill", "#000000")
      filtered.selectAll("text")
        .style("font-size","14px")
        .style("fill", "#000000")
      console.log(filtered)
    }

    // Public API here
    return {
      setForce: function (entities, links) {
        setForce(entities, links)
      },
      updateForce: function(type){
        updateForce(type);
      }
    };
  });
