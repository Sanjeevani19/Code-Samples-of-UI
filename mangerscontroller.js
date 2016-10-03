
var app = angular.module("mangers", []);

app.controller("mangerscontroller", ['$scope', '$filter', function ($scope, $filter) {

    $scope.emp = [{ id: 1, name: "emp1", phoneno: "9898989899", email: "emp1@outllok.com", img: "img1.jpg" },
        { id: 2, name: "emp2", phoneno: "9898989899", email: "emp2@outllok.com", img: "img2.jpg" },
        { id: 3, name: "emp3", phoneno: "9898989899", email: "emp3@outllok.com", img: "img3.jpg" },
        { id: 4, name: "emp4", phoneno: "9898989899", email: "emp4@outllok.com", img: "img4.jpg" },
        { id: 5, name: "emp5", phoneno: "9898989899", email: "emp5@outllok.com", img: "img5.jpg" }]; //sample data for emplyoees

    $scope.assigneddemp = [{ empid: 1, assigneid: 2 }, { empid: 1, assigneid: 3 },
    { empid: 1, assigneid: 4 }, { empid: 2, assigneid: 4 }, { empid: 3, assigneid: 2 },
    { empid: 3, assigneid: 1 }, { empid: 4, assigneid: 3 }, { empid: 5, assigneid: 1 },
    { empid: 5, assigneid: 2 }]//sample data for assignees

    $scope.selectedid = 0;
    $scope.AllUsersData = $scope.emp;
    $scope.selectedusersIds = [];
    $scope.imagsrc = "images/img0.jpg";
    $scope.savebutton = "Save";
    $scope.emailreqmsg = "";

    $scope.getcountofassignees = function (id) { //for get count of assignees
        var count = [];
        count = $filter("filter")($scope.assigneddemp, { empid: id }, true);
        return count.length;
    }
    
    $scope.edit = function (id) { //edit emplyoee       
        $scope.clear();
        $scope.selectedid = parseInt(id);
        var selecteddata = [];
        var selectedassignees = [];
         selecteddata = $filter("filter")($scope.emp, { id: $scope.selectedid }, true);
        if (selecteddata.length > 0) {
            $scope.first_name = selecteddata[0].name;
            $scope.phoneno = selecteddata[0].phoneno;
            $scope.email = selecteddata[0].email;
            $scope.imageselection = selecteddata[0].img.substr(3, 1);
            $scope.imagsrc = "images/img" + $scope.imageselection + ".jpg";
        }
         selectedassignees = $filter("filter")($scope.assigneddemp, { empid: $scope.selectedid }, true);
       
        for (var i = 0; i < selectedassignees.length; i++) {
            var selecteddataemp = $filter("filter")($scope.emp, { id: parseInt(selectedassignees[i].assigneid) }, true);
            if (selecteddataemp.length > 0)
                $scope.selectedusersIds.push(selecteddataemp[0]);
        }
        
        $scope.savebutton = "Update";
        $('#modal1').openModal();
    }   

    $scope.imagechange = function () { //image select change event
        if (!$scope.imageselection)
            $scope.imagsrc = "images/img0.jpg";
        else
            $scope.imagsrc = "images/img" + $scope.imageselection + ".jpg";
    }

    $scope.clear = function () { //clear emp data
        $scope.first_name = "";
        $scope.phoneno = "";
        $scope.email = "";
        $scope.selectedusersIds = [];
        $scope.imageselection = "";
        $scope.imagsrc = "images/img0.jpg";
        $scope.emailreqmsg = "";
        $scope.emailreq = false;
        $scope.phonenumreq = false;
        $scope.namereq = false;
    }

    $scope.add = function () {  //add new employee click
        $scope.clear();
        $scope.savebutton = "Save";
        $('#modal1').openModal();
    }

  
    $scope.reset = function () { //reset button click
        $scope.clear();
    }

    $scope.cancel = function () {  //cancel button click
        $scope.clear();
        $('#modal1').closeModal();
    }

    $scope.save = function () { //save and update employee details
        var valid = true;
        $scope.namereq = false;
        $scope.phonenumreq = false;
        $scope.emailreq = false;
        if (!$scope.first_name) {
            $scope.namereq = true;
            $scope.namereqmsg = "Required";
            return valid = false;
        }
        else if (/^[a-zA-Z0-9- ]*$/.test($scope.first_name) == false) {
            $scope.namereq = true;
            $scope.namereqmsg = "Invalid Name";
            return valid = false;
        }
        if (!$scope.phoneno) {
            $scope.phonenumreq = true;
            $scope.phonenummsg = "Required";
            return valid = false;
        }
        else if (/^[a-zA-Z- ]*$/.test($scope.phoneno) == true) {
            $scope.phonenumreq = true;
            $scope.phonenummsg = "Invalid Phone number";
            return valid = false;
        }
        if (!$scope.email) {
            $scope.emailreq = true;
            $scope.emailreqmsg = "Required";
            return valid = false;
        }
        else if (!validateEmail($scope.email)) {
            $scope.emailreq = true;
            $scope.emailreqmsg = "Invalid Email";
            return valid = false;
        }
        if ($scope.savebutton == "Save") {
            var id = 1;
            if ($scope.emp.length > 0)
                id = $scope.emp[$scope.emp.length-1].id + 1;
            var obj = {};
            obj.id = id;
            obj.name = $scope.first_name;
            obj.phoneno = $scope.phoneno;
            obj.email = $scope.email;
            if ($scope.imageselection)
                obj.img = "img" + $scope.imageselection + ".jpg"
            else
                obj.img = "img0.jpg"
            $scope.emp.push(obj);

            for (var i = 0; i < $scope.selectedusersIds.length; i++) {
                var newobj = {}
                newobj.empid = parseInt(id);
                newobj.assigneid = parseInt($scope.selectedusersIds[i].id);
                $scope.assigneddemp.push(newobj);
            }
            var $toastContent = $('<span>Employee added successfully</span>');
            Materialize.toast($toastContent, 3000);
            $('#modal1').closeModal();
        }
        else {
            var selecteddata = [];
             selecteddata = $filter("filter")($scope.emp, { id: $scope.selectedid }, true);
            if (selecteddata.length > 0) {
                selecteddata[0].name = $scope.first_name;
                selecteddata[0].phoneno = $scope.phoneno;
                selecteddata[0].email = $scope.email;
                if ($scope.imageselection)
                    selecteddata[0].img = "img" + $scope.imageselection + ".jpg"
                else
                    selecteddata[0].img = "img0.jpg"
            }
            var selectedassignees = [];
             selectedassignees = $filter("filter")($scope.assigneddemp, { empid: $scope.selectedid }, true);
            for (var i = 0; i < selectedassignees.length; i++) {
                $scope.assigneddemp.splice($scope.assigneddemp.indexOf(selectedassignees[i]), 1);
            }
            for (var i = 0; i < $scope.selectedusersIds.length; i++) {
                var newobj = {}
                newobj.empid = parseInt($scope.selectedid);
                newobj.assigneid = parseInt($scope.selectedusersIds[i].id);
                $scope.assigneddemp.push(newobj);
            }
            var $toastContent = $('<span>Employee updated successfully</span>');
            Materialize.toast($toastContent, 3000);           
            $('#modal1').closeModal();
        }
    }

    function validateEmail(email) { //email validation function
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    $scope.delete = function (id) { //delete employee
        var r = confirm("Are you sure you want to delete");
        if (r == true) {
            var selectedassignees = [];
            selectedassignees = $filter("filter")($scope.assigneddemp, { assigneid: parseInt(id) }, true);
            if (selectedassignees.length > 0) {
                var $toastContent = $('<span>Sorry this employee assigned to some one</span>');
                Materialize.toast($toastContent, 3000);
            }
            else {
                var selecteddata = [];
                selecteddata = $filter("filter")($scope.emp, { id: parseInt(id) }, true);
                if (selecteddata.length > 0) {
                    $scope.emp.splice($scope.emp.indexOf(selecteddata[0]), 1);
                }
                var selectedassignees = [];
                selectedassignees = $filter("filter")($scope.assigneddemp, { empid: parseInt(id) }, true);
                for (var i = 0; i < selectedassignees.length; i++) {
                    $scope.assigneddemp.splice($scope.assigneddemp.indexOf(selectedassignees[i]), 1);
                }
                var $toastContent = $('<span>Employee Deleted Successfully</span>');
                Materialize.toast($toastContent, 3000);
            }
        } 

    }
   
    

}]);

app.directive("multiSelect", [function ($window) {  //directive for multiselect employees
    return {
        restrict: "E",
        scope: {
            totaldata: '=',
            selecteddata: '=',
            id: '@',
            onselect: '&?',
            disabeledids: '=',
            disable: '=',
        },
        link: function (scope, element, attrs) {

            scope.disabeled = [];
            scope.disabeledcnt = [];
            scope.outsideclickclose = 0;
            if (scope.disabeledids)
                scope.disabeled = scope.disabeledids;
            scope.$watch(function () {
                scope.disabeldmode = false;
                if (scope.disable) {
                    scope.disabeldmode = true;
                }
            });
            scope.disabeledcnt = scope.disabledcntrl;
            scope.enteredclick = false;
            $(window).bind('click', function (event) {
                if (!scope.searchfocus)
                    scope.datacontainershow = false;
                scope.searchfocus = false;
                if (scope.outsideclickclose == 0)
                    scope.datacontainershow = false;
                scope.outsideclickclose = 0;
                scope.searchtext = "";
                scope.$apply();
            });
            scope.searchboxfocus = function () {
                scope.rowid = 0;
                scope.outsideclickclose = 1;
                if (!scope.enteredclick) {
                    scope.datacontainershow = true;
                    scope.searchfocus = true;
                }
                scope.enteredclick = false;
            }
            scope.searchboxclick = function () {
                scope.rowid = 0;
                scope.datacontainershow = true;
                scope.searchfocus = true;
            }
            scope.selectitem = function (data) {
                scope.outsideclickclose = 1;
                scope.enteredclick = true;
                $("#searchtextbox" + scope.id).focus();
                if (!attrs.onselect) {
                    if (scope.selecteddata.indexOf(data) == -1)
                        scope.selecteddata.push(data);
                }
                else
                    scope.onselect({ 'data': data });
                scope.searchtext = "";
                scope.datacontainershow = false;
                scope.searchfocus = false;
            }
            scope.searchboxchange = function () {
                scope.datacontainershow = true;
                scope.searchfocus = true;
            }
            scope.searchboxkeydown = function (event) {
                if (event.which == 9) {
                    scope.datacontainershow = false;
                    scope.searchfocus = false;
                }
                if (event.which == 40) {
                    scope.datacontainershow = true;
                    scope.searchfocus = true;
                    scope.rowid = 0;
                    if (scope.rowid == 0) {
                        $("#alldatacontainer" + scope.id).focus();
                        $("#alldatacontainerul" + scope.id).scrollTop(0);
                        scope.rowid = 1
                        return false;
                    }
                }
                if (event.which == 8) {
                    if (!scope.searchtext) {
                        if (scope.selecteddata.length > 0) {
                            if (scope.disabeled.indexOf(scope.selecteddata[scope.selecteddata.length - 1].UID) == -1)
                                scope.selecteddata.splice(-1, 1);
                            scope.datacontainershow = false;
                            scope.searchfocus = false;
                        }
                    }
                }
            }
            scope.autocompelatekeydown = function (event, data) {
                if (event.which == 40) {
                    if (scope.rowid != 0 && data.length > scope.rowid) {
                        if ($("#autoli" + scope.id + scope.rowid)) {
                            scope.rowid++;
                            if (($("#autoli" + scope.id + scope.rowid).offset().top
                                - $("#alldatacontainerul" + scope.id).offset().top) >= $("#alldatacontainer" + scope.id).height())
                                $("#alldatacontainerul" + scope.id).scrollTop($("#autoli" + scope.id + scope.rowid).index()
                                    * $("#autoli" + scope.id + scope.rowid).outerHeight() - $("#alldatacontainer" + scope.id).height())
                        }
                        return false;
                    }
                }
                else if (event.which == 38) {
                    if (scope.rowid > 1) {
                        if ($("#autoli" + scope.id + scope.rowid)) {
                            scope.rowid--;
                            if (($("#autoli" + scope.id + scope.rowid).offset().top
                                - $("#alldatacontainerul" + scope.id).offset().top) <= 0)
                                $("#alldatacontainerul" + scope.id).scrollTop($("#autoli" + scope.id + scope.rowid).index()
                                    * $("#autoli" + scope.id + scope.rowid).outerHeight()
                                    - $("#autoli" + scope.id + scope.rowid).height() - 10);
                            return false;
                        }
                    }
                }
                else if (event.which == 13) {
                    scope.outsideclickclose = 1;
                    scope.enteredclick = true;
                    $("#searchtextbox" + scope.id).focus();
                    if (!attrs.onselect) {
                        if (scope.selecteddata.indexOf(data[scope.rowid - 1]) == -1)
                            scope.selecteddata.push(data[scope.rowid - 1]);
                    }
                    else
                        scope.onselect({ 'data': data[scope.rowid - 1] });
                    scope.searchtext = "";
                    scope.datacontainershow = false;
                    scope.searchfocus = false;
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    event.stopPropagation();
                    return false;
                }
                else if (event.which == 9) {
                    scope.datacontainershow = false;
                    scope.searchfocus = false;
                }
                else if (event.which == 8) {
                    scope.rowid = 0;
                    $("#searchtextbox" + scope.id).focus();
                    if (scope.searchtext)
                        scope.searchtext = String(scope.searchtext).substring(0, String(scope.searchtext).length - 1);
                }
                else {
                    if (!scope.searchtext)
                        scope.searchtext = "";
                    scope.searchtext = String(scope.searchtext) + String.fromCharCode(event.keyCode | event.charCode);
                    scope.rowid = 0;
                    $("#searchtextbox" + scope.id).focus();
                }
                event.preventDefault();
                event.stopImmediatePropagation();
                event.stopPropagation();
            }
            scope.removefromselectedcontainer = function (data) {
                if (scope.selecteddata.indexOf(data) > -1) {
                    scope.selecteddata.splice(scope.selecteddata.indexOf(data), 1);
                }
            }
        },
        template:
            '<div class="selected-users">'+
'<div id="selectedcontainer{{id}}" ng-repeat="data in selecteddata" class="auto-compelate"> '+                                                
 '<div class="chip">'+
    ' <img src="images/{{data.img}}" alt="Contact Person">   '+
    ' {{data.name}}  '+
    '  <i class="material-icons" ng-show="disabeled.indexOf(data.UID)==-1 && !disabeldmode" ng-click="removefromselectedcontainer(data)">close</i></div>'+
'</div></div>'+
'<input type="text" id="searchtextbox{{id}}" '+
  '  class="validate" tabindex="1" ng-model="searchtext"'+
 '   ng-change="searchboxchange()"  ng-focus="searchboxfocus()" '+
  '  ng-click="searchboxclick()" ng-keydown="searchboxkeydown($event)" ng-disabled="disabeldmode" /> <!--ng-disabled="disabeledcontrol" || !disabeledcontrol-->'+
    '<div id="alldatacontainer{{id}}" class="autocompelate" tabindex="-1" '+
'ng-keydown="autocompelatekeydown($event,AllUsersDatafiltered)" '+
'ng-show="datacontainershow"> '       +
'<ul unselectable="on" class="k-list k-reset"  id="alldatacontainerul{{id}}"'+
'tabindex="-1" aria-hidden="false" aria-live="polite" data-role="staticlist"'+
'role="listbox" style="overflow: auto; height: 198px;">'+
'<li tabindex="-1" role="option" '+
'ng-repeat="data in AllUsersDatafiltered=(totaldata | filter:{name:searchtext})" '+
'unselectable="on" class="k-item ng-scope" '+
'data-offset-index="{{$index}}" '+
'ng-click="selectitem(data)" id="autoli{{id}}{{$index}}"'+
'ng-class="{\'activey\':$index==rowid-1,\'selected\':selecteddata.indexOf(data)>-1}">{{data.name}}</li></ul>'+
'</div>'
    };
}]);
