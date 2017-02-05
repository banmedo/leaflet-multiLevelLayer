#**leaflet-multiLevelLayer**
*This is a leaflet plugin for creating a layer control that can categorize layers into groups and subgroups*

This plugin requires following to work

1. Leaflet (1.11.2 or newer)
2. jquery (0.7.3 or newer)

*[Note: it could work with older versions but said versions were the only ones that were used for testing]*

This is fairly easy to implement

First, create a object

> var multilayerobject = new L.Control.MultiLevelLayer();

Then create a group using the object, provide group name

> var group = multilayerobject.createGroup("Group");

After that create a sub group using the multilayerobject and add to the group object

>var subgroup = group.addSubGroup( multilayerobject.createSubGroup( "SubGroup1" ) );

Finally add a layer to the sub group,

> subgroup.addLayer(layer1,"name: layer1","iconurl (optional)")

This can go as deep as you want. 
