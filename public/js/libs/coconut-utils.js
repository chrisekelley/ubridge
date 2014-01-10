define(['backbone','FORMY'],function(Backbone, FORMY) {
  'use strict';

  var coconutUtils = {};

  coconutUtils.refreshChart = function (id, name) {
    document.getElementById(id).innerHTML = name;
  }

// kudos: http://snipplr.com/view/26338/cascading-select-boxes/  - Creative Commons Attribution-Share Alike 3.0 Unported License
  coconutUtils.cascadeSelect = function (parent, child){
    var childOptions = child.find('option:not(.static)');
    //console.log("sorting");
    //childOptions.sort(sortBylabelAlpha);
    child.data('options',childOptions);
    //console.log("childOptions: " + JSON.stringify(childOptions))
    parent.change(function(){
      childOptions.remove();
      console.log("changing");
      var filteredData = child.data('options').filter('.sub_' + this.value);
      var sortedFilteredData = filteredData.sort(coconutUtils.sortBylabelAlpha);
      //console.log("sortedFilteredData: " + JSON.stringify(sortedFilteredData));
      child
        .append(sortedFilteredData)
        .change();
    });
    childOptions.not('.static, .sub_' + parent.val()).remove();
  }

  coconutUtils.sortBylabelAlpha = function (a,b) {
    //var result = a.label.toLowerCase() > b.label.toLowerCase();
    //console.log(a.label.toLowerCase() + ":" + b.label.toLowerCase() + "= " + result);
    var nameA=a.label.toLowerCase(), nameB=b.label.toLowerCase()
    if (nameA < nameB) //sort string ascending
      return -1;
    if (nameA > nameB)
      return 1;
    return 0; //default return value (no sorting)
    //return result;
  }

  coconutUtils.loadCascadedSelects = function loadCascadedSelects(){
    var cascadeForm = $('#theForm');
    var subcounty = cascadeForm.find('#subcounty');
    var village = cascadeForm.find('#village');
    coconutUtils.cascadeSelect(subcounty, village);
  }

//window.onload = loadCascadedSelects;

  coconutUtils.checkVersion = function () {
    console.log("Checking for new version of app.");
    $.ajax({ type: "GET", url: "https://dl.dropboxusercontent.com/s/nxvrvdtpvmqomxd/version.xml?token_hash=AAHFO2PaE2L6pTZQoDYYU1PVAKS6qMK6__PZgU3LYzUgGg&dl=1", dataType: "xml",
      success: function(xml) {
        console.log("xml: " + xml);
        $(xml).find('version').each(function(){
          var vcode = $(this).find('v_code').text(); //get the v_code in the xml file
          console.log("Remote version: " + vcode);
          window.plugins.version.getVersionCode(
            function(version_code) {
              console.log("Installed version: " + version_code);
              if(version_code != vcode){
                console.log("Upgrade app!");
                navigator.notification.beep(3);
                navigator.notification.vibrate(2000);
                navigator.notification.confirm(
                  'A new version is out! Get it now!',  // message
                  onVersion,            // callback to invoke with index of button pressed
                  'Update available',                 // title
                  ['Update now!', 'Maybe later']     // buttonLabels
                );
              }
            },
            function(errorMessage) {
              console.log("Error while downloading update: " + errorMessage);
            }
          );
        });
      }
    });
  }

  coconutUtils.onVersion = function (button) {
    if(button == 1){
      //window.open('https://dl.dropbox.com/s/o1kur0w2skwx7a3/Olutindo-debug.apk?dl=1','_blank');
      downloadFile()
    }
  }

//kudos: http://stackoverflow.com/questions/11455323/how-to-download-apk-within-phonegap-app
//http://www.raymondcamden.com/index.cfm/2013/5/1/Using-the-Progress-event-in-PhoneGap-file-transfers
  coconutUtils.downloadFile = function (){
    var fileSystem;
    console.log("downloading file.")

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
      function(fs) {
        fileSystem = fs;
        var ft = new FileTransfer();
        var uri = encodeURI("https://dl.dropbox.com/s/o1kur0w2skwx7a3/Olutindo-debug.apk?dl=1");
        var downloadPath = fileSystem.root.fullPath + "/Olutindo-debug.apk";
        navigator.notification.progressStart("Application Update", "Initiating download...");
        ft.onprogress = function(progressEvent) {
          if (progressEvent.lengthComputable) {
            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            //statusDom.innerHTML = perc + "% loaded...";
            navigator.notification.progressValue(perc);
          }
        };
        ft.download(uri, downloadPath,
          function(theFile) {
            navigator.notification.progressStop();
            console.log("download complete: " + theFile.toURL());
            window.plugins.webintent.startActivity({
                action: window.plugins.webintent.ACTION_VIEW,
                url: 'file://' + theFile.fullPath,
                type: 'application/vnd.android.package-archive'
              },
              function() {},
              function() {
                alert('Failed to open URL via Android Intent.');
                console.log("Failed to open URL via Android Intent. URL: " + theFile.fullPath)
              }
            );
          },
          function(error) {
            alert("download error: " + JSON.stringify(e));
            console.log("download error: " + JSON.stringify(e));
          });
      }, function(e) {
        alert('failed to get fs: ' + JSON.stringify(e));
        console.log("failed to get fs: " + JSON.stringify(e));
      });
  }

  coconutUtils.saveLoginPreferences = function (username, password, site, department) {
    console.log("Saving login prefs. username: " + username + " password: " + password + " site: "  + site + " department:" + department);
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
      window.applicationPreferences.set("username", username, function() {
      }, function(error) {
        console.log("Error! " + JSON.stringify(error));
      });
      window.applicationPreferences.set("password", password, function() {
      }, function(error) {
        console.log("Error! " + JSON.stringify(error));
      });
      window.applicationPreferences.set("site", site, function() {
      }, function(error) {
        console.log("Error! " + JSON.stringify(error));
      });
      window.applicationPreferences.set("department", department, function() {
      }, function(error) {
        console.log("Error! " + JSON.stringify(error));
      });
      console.log("Successfully saved login preferences.");
      var account = new Object();
      account.username = username;
      account.password = password;
      account.site = site;
      account.department = department;
      StartReplication(account);
      UrbanAirshipRegistration(account);
    } else {
      console.log("Login prefs *not* saved. They currently saved only on smartphone version.")
    }
  }

  coconutUtils.getLoginPreferences = function () {
    var account = new Object();
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
      window.applicationPreferences.get("username", function(value) {
        account.username = value;
      }, function(error) {
        alert("Welcome to Olutindo! Please login so that the app can receive records from the server.");
        console.log("The username is not stored in preferences; displayed sign in notice. Error Message: " + JSON.stringify(error));
        //$form = $.modalForm({fields: [ 'username', 'password', 'site', 'department' ], submit: 'Sign in'})
        //FORMY.router.navigate('config', {trigger: true});
        return null;
      });
      window.applicationPreferences.get("password", function(value) {
        account.password = value;
      }, function(error) {
        //alert("Error! " + JSON.stringify(error));
        //console.log("Error! " + JSON.stringify(error));
      });
      window.applicationPreferences.get("site", function(value) {
        account.site = value;
      }, function(error) {
        //alert("Error! " + JSON.stringify(error));
        //console.log("Error! " + JSON.stringify(error));
      });
    } else {
      account.username = "testuser";
      account.password = "testuserPassword";
      account.site = "aru";
      //alert("Welcome to Olutindo! Please sign in so that the app can receive records from the server.");
      //FORMY.router.navigate('config', true);
    }
    return account;
  }

  coconutUtils.StartReplication = function (account) {
    if (account != null && account.username != null) {
      var credentials = account.username + ":" + account.password;
      var couchdb =  "troubletickets_" +  account.site;
      var subdomain =  "ug" +  account.site;

      var remoteCouch = "http://" + credentials + "@192.168.1.60:5984/" + couchdb + "/";
      // CORS reverse proxy for Cloudant
//    var remoteCouch = "http://localhost:3000/troubletickets/" + subdomain + "/" + credentials;
//    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
//      remoteCouch = "https://" + credentials + "@" + subdomain + ".cloudant.com/troubletickets/";
//    }

      console.log("start replication with " + remoteCouch)
      FORMY.ReplicationStarted = true;
      //var opts = {continuous: true, withCredentials:true, cookieAuth: {username:account.username, password:account.password}, auth: {username:account.username, password:account.password}};
      var opts = {continuous: true,
        withCredentials:true,
        //cookieAuth: {username:account.username, password:account.password},
        auth: {username:account.username, password:account.password},
        complete: coconutUtils.onComplete,
        timeout: 60000};
      //var opts = {continuous: true, withCredentials:true};
      //var opts = {continuous: true};
      //$("#alertMessage").html('<img src="../images/network_drive_connected_40.png"/>');
      FORMY.SyncStatus.html = '<img src="images/network_drive_connected_40.png"/>';
      Backbone.sync.defaults.db.replicate.to(remoteCouch, opts, coconutUtils.ReplicationErrorLog);
      //localDB.replicate.from('http://relax.com/on-the-couch', {withCredentials:true, cookieAuth: {username:'admin', password:'pass'}}, function(){});
      Backbone.sync.defaults.db.replicate.from(remoteCouch, opts, coconutUtils.ReplicationErrorLog);
    }
  }

  coconutUtils.ReplicationErrorLog = function(err, result) {
    if (result !=null && result.ok) {
      console.log("Replication is fine. ")
      //$("#alertMessage").html('<img src="../images/network_drive_connected_40.png"/>');
      FORMY.SyncStatus.html = '<img src="images/network_drive_connected_40.png"/>';
    } else {
      console.log("Replication error: " + JSON.stringify(err));
      //$("#alertMessage").html('<img src="../images/network_drive_offline_40.png"/>');
      FORMY.SyncStatus.html = '<img src="images/network_drive_offline_40.png"/>';
      if ((typeof err != 'undefined') && (err.status === 401)) {
        alert("Error: Name or password is incorrect. Unable to connect to the server.");
      }
    }
  }

  coconutUtils.UrbanAirshipRegistration = function (account) {

    if (typeof window.plugins != 'undefined') {
      push = window.plugins.pushNotification;

      // Callback for when a device has registered with Urban Airship.
      push.registerEvent('registration', function (error, id) {
        if (error) {
          console.log('There was an error registering for push notifications');
        } else {
          console.log("Registered with ID: " + id);
        }
      });
      // Callback for when the app is running, and receives a push.
      push.registerEvent('push', function (push) {
        console.log("Got push: " + push.message)
      });

      if (account != null && account.username != null) {
        // Set an alias, this lets you tie a device to a user in your system
        push.setAlias(account.username, function () {
          push.getAlias(function (alias) {
            console.log("The user formerly known as " + alias)
          });
        });
      }
      // Check if push is enabled
      push.isPushEnabled(function (enabled) {
        if (enabled) {
          console.log("Push is enabled! Fire away!");
        }
      })
    }
  }



  coconutUtils.onComplete = function (err, result) {
    if (result.ok) {
      console.log("onComplete: Replication is fine. ")
    } else {
      console.log("onComplete: Replication error: " + JSON.stringify(err));
    }
  }

  coconutUtils.signIn = function() {
    //$form = $.modalForm({fields: [ 'username', 'password', 'site', 'department' ], submit: 'Sign in'})
    $.modalForm({fields: [ 'username', 'password', 'site', 'department' ], submit: 'Sign in'})
    //$form.on('submit', handleSignInSubmit( 'signin' ))
    //$form.on('submit', handleSignInSubmit());
  }

  coconutUtils.handleSignInSubmit = function() {
    saveLoginPreferences($("#username").val(), $("#password").val(), $("#site-dropwdown").val(), $("#department-dropwdown").val());
    $("#SigninForm").hide();
//  return function(event, inputs) {
//    console.log("Submitting signin form.")
//    var $modal = $(event.target)
//    saveLoginPreferences(inputs.username, inputs.password, inputs.site, inputs.department);
//    $modal.modal('hide')
//  }
  }

// uuid
// ------

// This is borrowed from Hood.ie

// helper to generate unique ids.
  coconutUtils.uuidGenerator = function(len) {
    var chars, i, radix;

    // default uuid length to 7
    if (len === undefined) {
      len = 7;
    }

    // uuids consist of numbers and lowercase letters only.
    // We stick to lowercase letters to prevent confusion
    // and to prevent issues with CouchDB, e.g. database
    // names do wonly allow for lowercase letters.
    chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
    radix = chars.length;

    // eehmm, yeah.
    return ((function() {
      var _i, _results = [];

      for (i = _i = 0; 0 <= len ? _i < len : _i > len; i = 0 <= len ? ++_i : --_i) {
        var rand = Math.random() * radix;
        var char = chars[Math.floor(rand)];
        _results.push(chars[0] = String(char).charAt(0));
      }

      return _results;
    })()).join('');
  };

  /*
  Creates test incidents. You can supply an id if ct = 1.
  TODO: Accept a list of id's
   */
  function generateTestIncident(ct, id) {
    var testdoc = null;

    //var subcounty=randomFromTo(1,8).toString();
    var subcounty = 3;
    //var village=randomFromTo(1,180).toString();
    var village = 122;
    var priority = randomFromTo(1, 3).toString();
    var department = randomFromTo(1, 6).toString();
    var resolved = randomFromTo(0, 1).toString();
    var month = randomFromTo(1, 10);
    var day = randomFromTo(1, 31);
    switch (month) {
      case 10:
        day = randomFromTo(1, 11);
        break;
      case 9:
        day = randomFromTo(1, 30);
        break;
      case 4:
        day = randomFromTo(1, 30);
        break;
      case 2:
        day = randomFromTo(1, 27);
        break;
      case 6:
        day = randomFromTo(1, 30);
        break;
      case 11:
        day = randomFromTo(1, 30);
        break;
      default:
        day = randomFromTo(1, 31);
        break;
    }
    var unixTimestamp = Math.round(+new Date() / 1000);
    var created = unixTimestamp;
    var lastModified = created;

    //var id =  "test" + ct;
    if (id === null) {
      id = "test" + ct + "_" + created;
    }

    testdoc = { _id: id, "flowId": "300", "formId": "incident", "phone": "0772555" + ct, "description": "This is a test",
      "subcounty": subcounty, "village": village, "priority": priority, "department": department, "assignedId": ct.toString(),
      "resolved": resolved, "created": created, "lastModified": lastModified, "createdBy": "test", "type": "incident",
      "dep_administration": "1"};

    console.log("testdoc: " + JSON.stringify(testdoc));
    //db.saveDoc(testdoc, opts);
    var incident = new Incident(testdoc);
    incident.save();
    console.log("saved.")
    //return {subcounty: subcounty, village: village, priority: priority, department: department, resolved: resolved, month: month, unixTimestamp: unixTimestamp, created: created, lastModified: lastModified, id: id, incident: incident};
    return ct;
  }

  function randomFromTo(from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
  };

  function doSetTimeoutGenerateTestIncident(ct) {
    var interval = setInterval(function() {
      ct++;
      generateTestIncident(ct);
      if(ct >= (countTestDocs+1)) clearInterval(interval);
    }, 2000);
  }

  return coconutUtils;
});