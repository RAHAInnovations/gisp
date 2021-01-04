/*
	RAHA Innovations  
  Author : Parasa Kiran
  www.rahainnovations.com
	JavaScript Essentials
*/
class rahaMap {
    constructor(id) {
        this.map = '';
        this.id = id;
        this.markers = [];
        this.bounds;
    }
    getKey() {
        return this.id;
    }
    rahaInit(ma) {
        this.bounds = new google.maps.LatLngBounds();
    }
    fitBounds() {
        this.map.setZoom(5);
    }
    addMarker1(lat, lng) {
        var m1 = addMarker1(lat, lng, this.map);
    }
    createMap() {
        this.map = new google.maps.Map(document.getElementById('map'),{
            center: {
                lat: 20.5937,
                lng: 78.9629
            },
            zoom: 2.5,
            mapTypeControl: false,
            disableDefaultUI: true
        });
    }
    mapCenter(lat, lng) {
        var pos = {
            lat: lat,
            lng: lng
        };
        this.setCenter(pos);
    }
    addElementToTop(key, val) {
        if (key == 'oid') {
            this.markers[this.markers.length - 1].oid = val;
        } else if (val.search('embed') != -1) {
            this.markers[this.markers.length - 1].embed = val;
        } else if (val.search('img') != -1) {
            this.markers[this.markers.length - 1].image = val;
        }
    }
    setCenter(pos) {
        this.map.setCenter(pos);
    }
    addMarker(lat, lng, cc, name, o) {
        var anim = google.maps.Animation.DROP;
        var icon;
        if (cc == "") {
            icon = 'https://www.tripmantu.com/images/small_marker_red.png';
            if (o == 0)
                anim = google.maps.Animation.BOUNCE;
        } else {
            icon = 'http://www.tripmantu.com/images/icons8-marker-24.png';
        }
        var loc = {
            lat: parseFloat(lat),
            lng: parseFloat(lng)
        };
        var marker = new google.maps.Marker({
            animation: anim,
            position: loc,
            icon: icon,
            embed: null,
            name: name,
            image: null,
            embed: null,
            oid: o,
            map: this.map
        });
        this.markers.push(marker);
        this.bounds.extend(loc);
        google.maps.event.addListener(marker, 'click', function() {
            rm.openInfoWindow(marker)
        });
    }
    openInfoWindow(m) {
        /*if(!infowindow1)*/
        infowindow1 = new google.maps.InfoWindow({});
        var aboutString = "";
        var embed = "";
        var burl = "";
        var img = "";
        var dburl = "";
        if (m.image) {
            var img1 = JSON.parse(m.image);
            img = img1.img_url;
            burl = img1.burl;
            dburl = gd(burl);
        } else if (m.embed) {
            var e = JSON.parse(m.embed);
            embed = e.embed;
        }
        var desc = "";
        if ((desc == "") || (burl != "")) {
            desc = "<a  target='_blank' href='" + burl + "?" + j_g_utm + "'>" + dburl + "</a>";
        }
        if (m.url != "") {
            infowindow1.setContent(makeInfoContent(m.name, aboutString, img, desc, m.oid, embed));
        } else {
            infowindow1.setContent(makeInfoContent(m.name, "About", image, desc, m.oid, embed));
        }
        infowindow1.open(map, m);
    }

    getMarkerPositionForPoiOid(o) {
        for (var i = 0; i < this.markers.length; i++) {
            if (this.markers[i].oid == o)
                break;
        }
        if (i >= this.markers.length)
            return -1;
        else
            return i;
    }
    getMarkerForPos(p) {
        if (p < this.markers.length)
            return this.markers[p];
        else
            return null;
    }
}
function makeInfoContent(name, aboutString, image, desc, o='', embed='') {
    var txt = "";
    aboutString = "";
    txt = "<div class=iw-container style='border:0px solid red;'><div class='iw-title' style='position:fixed;width:90%;margin:auto;'>" + name + "</div><div class='iw-content' style='padding-top:50px;'><div class='iw-subTitle'>" + aboutString + "</div>" + "<img src='" + image + "' style='width:100%;min-width:200px;max-width:200px;height:auto;float:right;'><br>" + desc + "</div><div style='width:100%;text-align:center;min-height:30px;'>&nbsp;</div>";
    if (!j_g_self)
        return txt;
    m = rm.getMarkerPositionForPoiOid(o);
    if (m >= 0) {
        ma = rm.getMarkerForPos(m);
    }
    var p;
    var latlng;
    if (m >= 0) {
        p = ma.position;
        latlng = p.lat() + "," + p.lng();
    }
    txt += '<div style="padding:10px;background-color:white;position:fixed;bottom:2px;width:100%;margin:auto;z-index:9999"><img src=./images/link.png  style=\'width:10px;hieght:auto\' alt=\'External Image Link\' title=\'External Image Link\'><a target=_blank style=\'padding-left:5px;font-size:10px;background-color:transparent;\'><span></span></a><span style=\'float:right;padding-right:10px;width:20px;cursor:pointer;\' onclick="loadContributionImagePanel(this, event, \'' + name + '\', \'' + o + '\',\'image\',\'21\',\'' + latlng + '\')";>+</span></div>';
    txt += '</div>';
    txt += "</div>";
    return txt;
}
var infowindow1;
function rahaMapInit() {
    rm.createMap();
    rm.rahaInit(map);
    initMarkers();
    rm.fitBounds();
    var autocomplete2 = new google.maps.places.Autocomplete(di('pac-input2'));
    autocomplete2.addListener('place_changed', function() {
        var place = autocomplete2.getPlace();
        if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }
        var pos = place["geometry"]["location"];
        rm.addMarker(pos.lat(), pos.lng(), '', place.name, 0);
        var latlng = pos.lat() + "," + pos.lng();
        saveMarker(latlng, place["formatted_address"], place["name"]);
        rm.setCenter(pos);
    });
    if (!infowindow1)
        infowindow1 = new google.maps.InfoWindow({});
}
