/*-------------creating a leaflet multilevel layer control -------------*/
/*
* planned flow of program 
*   1. user will create groups, subgroups and layers
*   2. user will add them based on the hierarchy
*   3. on group toggle, every component within the group will be changed
*   4. on layer toggle, the layer will be switched on or off depending on the current state
*
* Tasks remaining
*   1. code completion (adding layer to map and minor missed details)
*   2. UI design
*   3. Error Handling
*
* Requirements
*   1. jquery 1.11.1 or up
*   2. leaflet
*   3. ()
*
*/
var mlllyrlist = [];
var mlllyrnamelist = [];

var MllyrGroup = function(name){  //class for groups
  this.type = "group";
  this.name = name;
  this.icon = ""
  this.child = [];
}
MllyrGroup.prototype.addSubGroup = function(subGroup){
  var y = this.child;
  y.push(subGroup);
}

MllyrGroup.prototype.addlayer = function(layer,name,icon){
  var temp = {};
  temp["type"] = "layer";
  temp["name"] = name;
  temp["index"] = mlllyrlist.length;
  if (typeof (icon) !== 'undefined') temp["icon"] = icon;
  mlllyrlist.push(layer);
  mlllyrnamelist.push(name);
  this.child.push(temp);
}

L.Control.MultiLevelLayer = L.Control.extend(
{
    options:
    {
        position: 'topright',
    },
    initialize:function(){
      this._list = [];
    },
    createGroup:function(name){
      var newgrp = new MllyrGroup(name);
      this._list.push(newgrp);
      return newgrp;
    },
    createSubGroup:function(name){
      var newgrp = new MllyrGroup(name);
      return newgrp;
    },
    getList:function(){
      return this._list;
    },
    onAdd: function (map) {
        this._map = map;
        this._div = L.DomUtil.create('div', 'switcher-console');
        this.update(0);
        return this._div;
    },
    update:function(value){
      var map = this._map;
      /*--------------Getting the HTML for the combo box ---------------------*/
      this._div.innerHTML = this._getInnerHTML(this._list);
      //$(".grouptoggle").parent().find('ul').slideToggle();
      /*--------------listening and response to checkbox toggle---------------*/
      $(".grouptoggle").click(function(){
        var childlist = $(this).parent().find("input[type=checkbox]");  //get all the child checkbox within the parent checkbox
        var flag = this.checked;
        for (var i = 0;i<childlist.length;i++){
          var child = $(childlist[i]);
          $(child).prop('checked',flag);                 //set child's checked state
          var lyrind = child.attr('index');
          if (lyrind>-1){                //check if the changed child is a layer or a group
            toggleLayer(lyrind,flag);
          }
        }
        if ((!$(this).hasClass("master"))&&(!flag)){
          brotherCheckHandler($(this));
        }
      });
      $(".layertoggle").click(function(){
        var flag = this.checked;
        var lyrind = $(this).attr('index');
        toggleLayer(lyrind,flag);
        if ((!$(this).hasClass("master"))&&(!flag)){
          brotherCheckHandler($(this));
        }
      });
         
      $(".collapse-toggle-pm").click(function(e){
        $(this).parent().find('ul').slideToggle();
        var text = $(this).text();
        $(this).empty();
        if (text=="-"){
          $(this).append("+");
        }
        else {
          $(this).append("-");
        }
        e.preventDefault();
      });

      $(".master").trigger("click");

      function toggleLayer(lyrind, flag){
        var layer = mlllyrlist[lyrind];
        //console.log(layer);
        if (flag){
          layer.addTo(map);             //change the layer here
        }else {
          map.removeLayer(layer);               //change the layer here
        }
      }
      function brotherCheckHandler(element){
        //console.log(element.parent().parent().children());
        var childlist = element.parent().parent().children("li");  //get all the brother elements
        var checked = false;
        for (var i = 0;i<childlist.length;i++){
          if ($(childlist[i]).children("input[type=checkbox]")[0].checked){
            checked = true;
            break;
          }
        }
        var parentBox = element.parent().parent().parent().parent().children("input[type=checkbox]")[0];
        if (!checked)
          $(parentBox).prop("checked", checked);
      }
    },
    _getInnerHTML:function(parent){
      var text = "<ul class = 'unstyled-list master'>";
      for (var i = 0; i< parent.length;i++){
        if (parent[i].type == "layer"){
          text += "<li><input type='checkbox' class='layertoggle master' index="+parent[i].index+">";
          text += "<img src='"+parent[i].icon+"' height=20 />"
          text += "<label>"+parent[i].name + "</label></li>";
        }
        else {
          text += "<li><span class='collapse-toggle-pm' style='cursor:pointer'>+</span> <input type='checkbox' class='grouptoggle master' index=-1>";
          text += "<label>"+parent[i].name + this.InnerHTMLListIterator(parent[i].child)+"</label></li>";
        }
      }
      text+= "</ul>";
      return text;
    },
    InnerHTMLListIterator:function(parent){
      var text = "<ul class = 'unstyled-list undisplayed'>";
      for (var i = 0; i< parent.length;i++){
        if (parent[i].type == "layer"){
          text += "<li><input type='checkbox' class='layertoggle' index="+parent[i].index+">";
          text += "<img src='"+parent[i].icon+"' height=20 />"
          text += "<label>"+parent[i].name + "</label></li>";
        }
        else {
          text += "<li><span class='collapse-toggle-pm' style='cursor:pointer'>-</span> <input type='checkbox' class=grouptoggle index=-1><label>"+parent[i].name + this.InnerHTMLListIterator(parent[i].child)+"</label></li>";
        }
      }
      text+= "</ul>";
      return text;
    }
});
