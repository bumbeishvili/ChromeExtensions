// application 
App = {}

// extension logical parts
PageContext = {
    TopButtons: {
        Vacancies: {}
    },
    GpaPlanner: {},
    TotalStatistics: {},
    SemesterStatistics: {},
    TsuChart: {}
}

Calculator = {} // calculation
SmsTsu = {}; // hardcoded sms.tsu.ge properties

Global = { // global used variables
    StudentGrades: {},
    StudentInfo: {},
    BadgeNumberCount: 0
};

Utilities = {}; // utility functions
Actions = {}

App.lastFunc = function() {

}




App.main = function() {
    console.log('main function started');
    App.initializeStaticVariables();
    App.startActions();

    App.initializeObjects();
    App.loadExternalFiles();
    App.renderHtml(); //async ,on success invoke synchronizedMain
}



App.synchronizedMain = function() {
    console.log('setting gpa planner requisites')
    PageContext.GpaPlanner.setGpaPlannerRequisites();
    console.log('setting gpa result');
    PageContext.GpaPlanner.setGpaResult();
    console.log('setting total statistics');
    PageContext.TotalStatistics.setTotalStatistics();
    console.log('inserting semester statistics');
    PageContext.SemesterStatistics.insertSemesterStatisticRows();
    // hideSystemGpa();
    console.log('attaching event handlers');
    App.attachEventHandlers();
    console.log('styling objects');
    App.styleObjects();
    console.log('initializing gpa chart');
    PageContext.TsuChart.initializeChart();
    console.log('initialising info buttons');
    PageContext.setInfoButtonProperties();
    PageContext.TopButtons.Vacancies.process();
    console.log('loading statements');
    App.loadStatement();

}


App.startActions = function() {

    chrome.storage.sync.get("info", function(data) {

        var string = data.info.birthDate;
        var parts = string.split('/');
        var d = new Date(parts[0], parseFloat(parts[1]) - 1, parts[2]); //convert to date 

        Global.StudentInfo.birthDate = d;
        Global.StudentInfo.sex = data.info.sex;
        Global.StudentInfo.grant = data.info.grant;
        Global.StudentInfo.speciality = data.info.speciality;
    });
}


App.initializeObjects = function() {
    Global.StudentGrades = Utilities.getStudentGrades();

    Utilities.getStudentFirtsName = function() {
        var text = get(SmsTsu.studentFirstNameSpanId).innerHTML;
        var regexPattern = /\s[ა-ჰ]+$/g; // get last word
        studentFirtsName = regexPattern.exec(text);
        studentFirtsName = String(studentFirtsName).trim();
        return studentFirtsName;
    }


    Utilities.getStudentLastName = function() {
        var text = get(SmsTsu.studentFirstNameSpanId).innerHTML;
        var regexPattern = /\:[ა-ჰ]+\s/g; // get word between symbol ":" and whitespace
        studentLastName = regexPattern.exec(text);
        studentLastName = String(studentLastName).trim();
        studentLastName = studentLastName.substring(1); //cut symbol ":"
        return studentLastName;
    }
    Utilities.getStudentCurrentSemester = function() {
        return parseFloat(get(SmsTsu.gradeTableId).rows[get(SmsTsu.gradeTableId)
            .rows.length - 1].cells[13].innerHTML);
    }

    Global.StudentInfo.firstName = Utilities.getStudentFirtsName();
    Global.StudentInfo.lastName = Utilities.getStudentLastName();
    Global.StudentInfo.currentSemester = Utilities.getStudentCurrentSemester()
    Global.StudentInfo.gpa = Utilities.getCurrentGpa();
    Global.StudentInfo.credits = Utilities.getCredits();
}


App.initializeStaticVariables = function() {
    // separate hardcoded variables
    Global.ContentIsLoaded = false;

    SmsTsu.gradeTableId = 'ctl00_C1_GridView1';
    SmsTsu.gpaSpanId = 'ctl00_C1_SumGPA';
    SmsTsu.creditsSpanId = 'ctl00_C1_SumTExt1';
    SmsTsu.layerTableClass = 'style1';
    SmsTsu.studentFirstNameSpanId = 'ctl00_Label1';


    SmsTsu.subjectNameColumnIndex = 1;
    SmsTsu.subjectPassedImageColumnIndex = 3;

    SmsTsu.subjectFirstPointColumnIndex = 4;
    SmsTsu.subjectSecondPointColumnIndex = 5;
    SmsTsu.subjectThirdPointColumnIndex = 6;
    SmsTsu.subjectFourthPointColumnIndex = 7;
    SmsTsu.subjectFifthPointColumnIndex = 8;

    SmsTsu.subjectFinalExamPointColumnIndex = 9;
    SmsTsu.subjectAdditionalExamPointColumnIndex = 10;


    SmsTsu.subjectFinalPointColumnIndex = 11;
    SmsTsu.subjectCreditColumnIndex = 12;
    SmsTsu.subjectSemesterColumnIndex = 13;
}

App.loadExternalFiles = function() {
    Utilities.loadjscssfile(
            "http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js",
            "js") //dynamically load "javascript.php" as a JavaScript file
    Utilities.loadjscssfile(
            "http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css",
            "css") ////dynamically load and add this .css file
}

App.loadStatement = function() {
    var statementUrl;
    if (testMode) {
        console.log('============== TEST WEB STATEMENT LOADING ============');
        statementUrl = 'https://www.googledrive.com/host/0B5Xx_P8ocy_bYThJcE9YekIyNmc';
    } else {
        statementUrl = 'https://www.googledrive.com/host/0B5Xx_P8ocy_bSGlhZjNyd0hyT1U'
    }
    $.ajax({
        url: statementUrl,
        success: function(data) {
            if (data.trim().indexOf("#MyContent") === 0) {
                data = data.trim().substring(10);
                $('#forStatements').append(data);
            }
            App.lastFunc();
        }
    });
}

App.renderHtml = function() {
    var div = document.createElement('div');
    div.setAttribute("class", "fullContainer");
    var htmlFileUrl;
    if (localFilesMode) {
        htmlFileUrl = "•causeError";
    } // local files mode is defined in SmsTsuScript.Js
    else {
        if (testMode) {
            console.log('=============== TEST WEB HTML LOADING =============');
            htmlFileUrl = 'https://googledrive.com/host/0B5Xx_P8ocy_bUXRZRmFnMnYyZmM';
        } else {
            htmlFileUrl = 'https://googledrive.com/host/0B5Xx_P8ocy_bckN5aGhreUNaeW8';
        }
    }

    $.ajax({
        url:htmlFileUrl,
        timeout:1000,
        success:function(data){
            $(div).html(data);
            console.log(
                'web html file successfully loaded'
            );
            console.log(
                'appending loaded html to body...'
            );
            document.body.appendChild(div);
            App.synchronizedMain();
            Global.ContentIsLoaded = true;
        },
        error: function(xhr, textStatus, error) {
            console.log(
                'web html file loading failed, loading local html ...'
            );
            var htmlLocalFileUrl = chrome.extension.getURL(
                "content/html.txt");
            $(div).load(htmlLocalFileUrl, function(response, status,
                xhr) {
                if (status == "error") {
                    console.log(
                        'failed to load local html file, i do not know what to do'
                    );
                } else {
                    console.log(
                        'local html file successfully loaded'
                    );
                    console.log(
                        'appending loaded html to body...'
                    );
                    document.body.appendChild(div);
                    App.synchronizedMain();
                }
            });
        }
    });

   
}

PageContext.GpaPlanner.setGpaPlannerRequisites = function() {
    var B = 0;
    C = 0, D = 0;
    E = 0;
    var B10 = 0;
    var C10 = 0,
        D10 = 0,
        E10 = 0;
    for (var e in Global.StudentGrades) {
        var point = parseFloat(Global.StudentGrades[e].point);
        var credit = parseFloat(Global.StudentGrades[e].credit)
        if (point >= 91) {} else if (point >= 81) {
            B++;
            if (credit > 5) B10++;
        } else if (point >= 71) {
            C++;
            if (credit > 5) C10++;
        } else if (point >= 61) {
            D++;
            if (credit > 5) D10++;
        } else {
            E++;
            if (credit > 5) E10++;
        }
    }
    set('credits', Utilities.getCredits());
    set('B', B);
    set('B10', B10);
    set('C', C);
    set('C10', C10);
    set('D', D);
    set('D10', D10);
    set('E', E);
    set('E10', E10);
}

PageContext.GpaPlanner.setGpaResult = function() {
    result = Calculator.calculateGpa(getValue('B'), getValue('B10'), getValue('C'), getValue(
            'C10'), getValue('D'), getValue('D10'), getValue('E'),
        getValue('E10'), getValue('credits'));
    get('GpaResult').innerHTML = result;
}

PageContext.TotalStatistics.setTotalStatistics = function() {
    get('currentCredits').innerHTML = Utilities.getCredits();
    get('currentGpa').innerHTML = Utilities.getCurrentGpa();
    get('currentAveragePoints').innerHTML = Utilities.getTotalAveragePoints();
    get('hunderedPoints').innerHTML = Utilities.getHundredPointSubjectCount();
    get('InternationalGpa').innerHTML = PageContext.TotalStatistics.getInternationalGpa(
        Utilities.getStudentGrades());
}

App.attachEventHandlers = function() {
    get('GpaTable').addEventListener("click", PageContext.GpaPlanner.setGpaResult);
    get('GpaTable').addEventListener("keyup", PageContext.GpaPlanner.setGpaResult);
    get('btnIntoDream').addEventListener("click", PageContext.turnDreamModeOn);
    $('#btnContactDeveloper').click(Actions.popupContactDeveloper);
    $('#btnHotContacts').click(Actions.popupNeedfulPhones);
    $('#btnOtherNews').click(Actions.popupOtherNews);
    $('#btnHotLinks').click(Actions.popupHotLinks);

}

App.styleObjects = function() {
    get(SmsTsu.gradeTableId).style.width = "100%";
}

PageContext.TsuChart.initializeChart = function() {
    var chartData = PageContext.TsuChart.getChartData();

    var lineChartData = {
        labels: chartData.legends,
        datasets: [{
            label: chartData.tooltips,
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "red",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "black",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: chartData.gpas
        }],
    }
    console.log('LOGGER _ success 1');
    var ctx = get("canvas").getContext("2d");
    window.myLine = new Chart(ctx).Line(lineChartData, {
        responsive: true,
        scaleShowHorizontalLines: false,
        scaleShowVerticalLines: false,
        bezierCurve: false,
        pointDotRadius: 3,
        datasetStrokeWidth: 2,
        tooltipTemplate: "<%= datasetLabel %>  GPA:<%= value %>", //add dinamic custom tooltip support
        pointHitDetectionRadius: 2
    });

    console.log('version 11');

}


Calculator.calculateGpa = function(B, B10, C, C10, D, D10, E, E10, credits) {
    var gamyofi = credits / 5 * 4;
    var gasayofi = gamyofi - 1 * (B + B10) - 2 * (C + C10) - 3 * (D + D10) -
        3.5 * (E + E10);
    var gpa = gasayofi / gamyofi * 4;
    if (isNaN(gpa) || gpa < 0) {
        gpa = 0;
    }
    if (gpa > 4) gpa = 4
    return gpa.toFixed(3);
}

PageContext.TotalStatistics.getInternationalGpa = function(studentGrades) {
    var studentGrades = Global.StudentGrades;
    var credits = 0,
        gradePoints = 0;
    for (var i in studentGrades) {
        var gradePoint = 0;
        if (studentGrades[i].point >= 95) gradePoint = 4;
        else if (studentGrades[i].point >= 90) gradePoint = 3.67;
        else if (studentGrades[i].point >= 87) gradePoint = 3.33;
        else if (studentGrades[i].point >= 83) gradePoint = 3;
        else if (studentGrades[i].point >= 80) gradePoint = 2.67;
        else if (studentGrades[i].point >= 77) gradePoint = 2.33;
        else if (studentGrades[i].point >= 73) gradePoint = 2;
        else if (studentGrades[i].point >= 70) gradePoint = 1.67;
        else if (studentGrades[i].point >= 67) gradePoint = 1.33;
        else if (studentGrades[i].point >= 63) gradePoint = 1;
        else if (studentGrades[i].point >= 60) gradePoint = 0.67;
        credits += parseFloat(studentGrades[i].credit)
        gradePoints += parseFloat(studentGrades[i].credit) * gradePoint;
    }
    result = gradePoints / credits;
    return result.toFixed(3);
}

Utilities.getGpaDataArray = function() {
    var grades = Global.StudentGrades;
    var credits = Utilities.getCredits();
    var gradeCondition = {
        B: 0,
        B10: 0,
        C: 0,
        C10: 0,
        D: 0,
        D10: 0,
        E: 0,
        E10: 0,
        creditsSum: 0
    }
    var gpaDataByCredits = [];
    var current = 0;
    while (gradeCondition.creditsSum <= credits) {
        grade = grades[current++];
        if (typeof grade === 'undefined') {
            break;
        };
        var point = parseFloat(grade.point);
        var credit = parseFloat(grade.credit);
        gradeCondition.creditsSum += credit;
        if (point >= 91) {} else if (point >= 81) {
            gradeCondition.B++;
            if (credit > 5) gradeCondition.B10++;
        } else if (point >= 71) {
            gradeCondition.C++;
            if (credit > 5) gradeCondition.C10++;
        } else if (point >= 61) {
            gradeCondition.D++;
            if (credit > 5) gradeCondition.D10++;
        } else {
            gradeCondition.E++;
            if (credit > 5) gradeCondition.E10++;
        }
        gpaDataByCredits.push(Calculator.calculateGpa(gradeCondition.B, gradeCondition.B10,
            gradeCondition.C, gradeCondition.C10, gradeCondition.D,
            gradeCondition.D10, gradeCondition.E, gradeCondition.E10,
            gradeCondition.creditsSum))
    }
    return gpaDataByCredits;
}

Utilities.getGpaBySemester = function(semester) {
    var index = -1;
    var grades = Global.StudentGrades;
    for (var i = 0; i < grades.length; i++)
        if (grades[i].semester <= semester) index++;
    return Utilities.getGpaDataArray()[index];
}


PageContext.TsuChart.getChartData = function() {
    var chartData = {};
    chartData.legends = [];
    chartData.gpas = Utilities.getGpaDataArray();
    chartData.tooltips = [];

    var legendLabel = '';
    var tooltip = '';
    var current = 0;
    var labelMaxSize = 6;

    var grades = Global.StudentGrades;

    while (true) {
        var grade = grades[current++];

        if (typeof grade === 'undefined') {
            break;
        }


        if (grade.subjectName.length > labelMaxSize) {
            legendLabel = grade.subjectName.substring(0, labelMaxSize);
        }

        tooltip = grade.subjectName + ' -  ქულა:' + grade.point;


        chartData.legends.push(legendLabel);
        chartData.tooltips.push(tooltip);
    }
    chartData.legends.push('X');
    return chartData;
}

PageContext.SemesterStatistics.insertSemesterStatisticRows = function() {
    var averagePointsTable = document.getElementById("averagePointsTable");
    var maxSemester = Utilities.getStudentCurrentSemester();
    for (var i = 1; i <= maxSemester; i++) {
        var row = averagePointsTable.insertRow(averagePointsTable.rows.length); // append row from bottom
        var semesterColumn = row.insertCell(0);
        var averagePointColumn = row.insertCell(1);
        var studentGradesColumn = row.insertCell(2);
        var studentGPAColumn = row.insertCell(3);
        semesterColumn.innerHTML = i;
        var avgPoint = Utilities.getAveragePointBySemester(i);
        if (avgPoint > 0) averagePointColumn.innerHTML = avgPoint;
        studentGradesColumn.innerHTML = Utilities.getStudentGradesBySemester(i);
        if (avgPoint > 0) studentGPAColumn.innerHTML = Utilities.getGpaBySemester(i);
    }
}

Utilities.getAveragePointBySemester = function(semester) {
    var studentGrades = Global.StudentGrades;
    var sumWeightedPoints = 0;
    var credits = 0;
    for (var e in studentGrades) {
        if (studentGrades[e].semester == semester) {
            sumWeightedPoints += parseFloat(studentGrades[e].point) *
                parseFloat(studentGrades[e].credit);
            credits += parseFloat(studentGrades[e].credit);
        }
    }
    var result = sumWeightedPoints / credits;
    return isNaN(result) ? 0 : result.toFixed(2);
}

Utilities.getStudentGradesBySemester = function(semester) {
    var studentGrades = Global.StudentGrades;
    var A = 0;
    var B = 0;
    var C = 0;
    var D = 0;
    var E = 0;
    for (var e in studentGrades) {
        if (studentGrades[e].semester == semester) {
            var point = parseFloat(studentGrades[e].point);
            if (point >= 91) A++;
            else if (point >= 81) B++;
            else if (point >= 71) C++;
            else if (point >= 61) D++;
            else E++;
        }
    }
    var studentGradeResult = "";
    if (A > 0) studentGradeResult += "A:" + A + " ";
    if (B > 0) studentGradeResult += "B:" + B + " ";
    if (C > 0) studentGradeResult += "C:" + C + " ";
    if (D > 0) studentGradeResult += "D:" + D + " ";
    if (E > 0) studentGradeResult += "E:" + E + " ";
    return studentGradeResult;
}

Utilities.getCurrentGpa = function() {
    result = get(SmsTsu.gpaSpanId).innerHTML;
    return parseFloat(result).toFixed(3);
}

Utilities.getCredits = function() {
    var element = get(SmsTsu.creditsSpanId).innerHTML.trim()
    var kreditebi = element.substring(element.length - 3);
    kreditebi = kreditebi.substring(kreditebi.indexOf(':') + 1);
    return kreditebi;
}



Utilities.getHundredPointSubjectCount = function() {
    var studentGrades = Global.StudentGrades;
    var count = 0;
    for (var e in studentGrades) {
        if (studentGrades[e].point == 100) count++;
    }
    return count;
}

Utilities.getTotalAveragePoints = function() {
    var studentGrades = Global.StudentGrades;
    var sumWeightedPoints = 0;
    var credits = 0;
    for (var e in studentGrades) {
        sumWeightedPoints += parseFloat(studentGrades[e].point) *
            parseFloat(studentGrades[e].credit);
        credits += parseFloat(studentGrades[e].credit);
    }
    var result = sumWeightedPoints / credits;
    return isNaN(result) ? 0 : result.toFixed(2);
}

Utilities.getStudentGrades = function(minPoints) {
    minPoints = typeof minPoints !== 'undefined' ? minPoints : 50;
    var studentGrades = []



    for (i = 1; i < get(SmsTsu.gradeTableId).rows.length; i++) {
        var studentGrade = {};
        studentGrade.point =
            get(SmsTsu.gradeTableId).
        rows[i].cells[SmsTsu.subjectFinalPointColumnIndex].innerHTML
        studentGrade.credit =
            get(SmsTsu.gradeTableId).
        rows[i].cells[SmsTsu.subjectCreditColumnIndex].innerHTML;
        studentGrade.semester =
            get(SmsTsu.gradeTableId).
        rows[i].cells[SmsTsu.subjectSemesterColumnIndex].innerHTML;
        studentGrade.subjectName =
            get(SmsTsu.gradeTableId).
        rows[i].cells[SmsTsu.subjectNameColumnIndex].innerHTML;
        //  understand if student really has studied subject in the past
        studentGrade.firstPointCell =
            get(SmsTsu.gradeTableId).
        rows[i].cells[SmsTsu.subjectFirstPointColumnIndex].innerHTML;
        if (studentGrade.point > minPoints) studentGrades.push(studentGrade);
    }
    return studentGrades;
}



function get(id) {
    return document.getElementById(id);
}

function set(elementId, value) {
    get(elementId).value = value;
}

function getValue(id) {
    var value = get(id).value.trim();
    if (value === '') value = 0
    return Number(value);
}

Utilities.loadjscssfile = function(filename, filetype) {
    if (filetype == "js") {
        //if fileName is a external JavaScript file
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
    } else if (filetype == "css") { //if fileName is an external CSS file
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("class", "markedForDeletion")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref != "undefined") document.getElementsByTagName("head")[
        0].appendChild(fileref)
}

Utilities.getRandomPointFiller = function() {
    var pointFillers = [];
    pointFillers.push({
        first: 20,
        second: 10,
        third: 10,
        four: "10",
        five: "10",
        final: "40",
        additionalExam: " "
    });
    pointFillers.push({
        first: 20,
        second: " ",
        third: 20,
        four: 5,
        five: 15,
        final: "17",
        additionalExam: "40"
    });
    pointFillers.push({
        first: 20,
        second: 10,
        third: 30,
        four: "",
        five: " ",
        final: "40",
        additionalExam: " "
    });
    pointFillers.push({
        first: 20,
        second: " ",
        third: 40,
        four: "",
        five: " ",
        final: "40",
        additionalExam: " "
    });
    pointFillers.push({
        first: 30,
        second: 10,
        third: 20,
        four: " ",
        five: " ",
        final: " ",
        additionalExam: "40"
    });
    pointFillers.push({
        first: 30,
        second: 30,
        third: " ",
        four: " ",
        five: " ",
        final: "5",
        additionalExam: "40"
    });
    pointFillers.push({
        first: 30,
        second: " ",
        third: " ",
        four: "25",
        five: "5",
        final: "40",
        additionalExam: " "
    });
    pointFillers.push({
        first: 20,
        second: 15,
        third: 15,
        four: "10",
        five: " ",
        final: "40",
        additionalExam: " "
    });
    pointFillers.push({
        first: 30,
        second: 20,
        third: 10,
        four: " ",
        five: "0",
        final: "40",
        additionalExam: " "
    });
    pointFillers.push({
        first: 30,
        second: " ",
        third: 20,
        four: "5",
        five: "5",
        final: " ",
        additionalExam: "40"
    });
    pointFillers.push({
        first: 30,
        second: " ",
        third: 10,
        four: "10",
        five: "10",
        final: "40",
        additionalExam: " "
    });
    pointFillers.push({
        first: 30,
        second: " ",
        third: 15,
        four: "5",
        five: "10",
        final: "40",
        additionalExam: " "
    });
    pointFillers.push({
        first: 30,
        second: " ",
        third: 24,
        four: "6",
        five: " ",
        final: "40",
        additionalExam: " "
    });
    pointFillers.push({
        first: 30,
        second: 30,
        third: " ",
        four: " ",
        five: " ",
        final: "9",
        additionalExam: "40"
    });
    pointFillers.push({
        first: 25,
        second: 5,
        third: "10",
        four: "20",
        five: " ",
        final: "17",
        additionalExam: "40"
    });
    pointFillers.push({
        first: 21,
        second: 19,
        third: "",
        four: "20",
        five: " ",
        final: "40",
        additionalExam: " "
    });
    var randomInt = Math.floor(Math.random() * pointFillers.length);
    console.log(randomInt);
    return pointFillers[randomInt];
}

PageContext.turnDreamModeOn = function() {
    swal("", "ოცნებიდან გამოსასვლელად დაა-refresh-ეთ გვერდი")
    var futureCredits = 0;
    for (i = 1; i < get(SmsTsu.gradeTableId).rows.length; i++) {
        futureCredits += parseFloat(get(SmsTsu.gradeTableId).rows[i].cells[
                SmsTsu.subjectCreditColumnIndex].innerHTML)
            //point
        get(SmsTsu.gradeTableId).rows[i].cells[SmsTsu.subjectFinalPointColumnIndex].innerHTML = 100;
        //mwvane ptichka
        get(SmsTsu.gradeTableId).rows[i].cells[SmsTsu.subjectPassedImageColumnIndex].innerHTML =
            '<img id="ctl00_C1_GridView1_ctl02_Image1" src="http://sms.tsu.ge/sms/Images/SystemImage/Ok.gif" style="border-width:0px;">'
            // middle exam points
        var pointFiller = Utilities.getRandomPointFiller()
        get(SmsTsu.gradeTableId).rows[i].cells[SmsTsu.subjectFirstPointColumnIndex].innerHTML = pointFiller.first;
        //other points
        get(SmsTsu.gradeTableId).rows[i].cells[SmsTsu.subjectSecondPointColumnIndex].innerHTML = pointFiller.second;
        get(SmsTsu.gradeTableId).rows[i].cells[SmsTsu.subjectThirdPointColumnIndex].innerHTML = pointFiller.third
        get(SmsTsu.gradeTableId).rows[i].cells[SmsTsu.subjectFourthPointColumnIndex].innerHTML = pointFiller.four;
        get(SmsTsu.gradeTableId).rows[i].cells[SmsTsu.subjectFifthPointColumnIndex].innerHTML = pointFiller.five;
        // finaluris qula
        get(SmsTsu.gradeTableId).rows[i].cells[SmsTsu.subjectFinalExamPointColumnIndex].innerHTML = pointFiller.final;
        //damatebitis
        get(SmsTsu.gradeTableId).rows[i].cells[SmsTsu.subjectAdditionalExamPointColumnIndex].innerHTML = pointFiller.additionalExam;
    }
    get(SmsTsu.gpaSpanId).innerHTML = 4;
    get(SmsTsu.creditsSpanId).innerHTML =
        'თქვენ მიერ დაგროვებული კრედიტების ჯამური რაოდენობა:' +
        futureCredits;
    $(".markedForDeletion").remove();
    $(".fullContainer").hide();
}

PageContext.setInfoButtonProperties = function() {
    $('#gpaPlannerInfo').click(function() {
        swal({
            title: "GPA Planner",
            text: "<div style='text-align:left;'>   <h4 style='font-weight:bold'>როგორ მუშაობს?</h4><p style='text-indent:10px' >    საშუალება გაქვთ გემოვნების მიხედვით ცვალოთ შეფასებები და კრედიტები და ნახოთ როგორ შეიცვლებოდა თქვენი GPA მსგავსი მდგომარეობის შემთხვევაში </p>" +
                "<h4 style='font-weight:bold'> ვისზე მუშაობს?</h4> <p style='text-indent:10px'> მუშაობს მხოლოდ თსუს იმ  სტუდენტებზე,რომელთაც აქვთ 5 ან 10 კრედიტიანი საგნები </p>" +
                "<h4 style='font-weight:bold'>რატომ არ ჩანს A შეფასებები?</h4> <p style='text-indent:10px'>  შეფასებებში A არ ჩანს , რადგან კრედიტის მატებისას ნაგულისხმევად ითვლება, რომ A-ს იღებთ </p> </div>",
            html: true
        })
    });
    $('#totalStatisticsInfo').click(function() {
        swal({
            title: "Total Statistics",
            text: "<div style='text-align:left;'>   <h4 style='font-weight:bold'>რის ნახვა შემიძლია?</h4><p style='text-indent:10px' >  " +
                " საშუალება გაქვთ ნახოთ მთლიანი საშუალო ქულა წონით (ათკრედიტიანს ორი საგნის წონა აქვს) , აგრეთვე უცხოეთში აპრობირებული მეთოდით გამოთვლილი GPA, რომელიც A+ , A- , B+ და ა.შ. ითვალისწინებს.  </p>",
            html: true
        });
    });
    $('#averagePointsInfo').click(function() {
        swal({
            title: "Semester Average",
            text: "<div style='text-align:left;'>   <h4 style='font-weight:bold'>რას ეხება ეს ბლოკი?</h4><p style='text-indent:10px' >  " +
                " ამ ბლოკში შეიძლება ნახოთ სემესტრების მიხედვით საშუალო ქულა, სემესტრში მიღებული შეფასება და იმ დროინდელი GPA.  </p>",
            html: true
        });
    });
    $('#chartInfo').click(function() {
        swal({
            title: "Gpa Chart",
            text: "<div style='text-align:left;'>   <h4 style='font-weight:bold'>რა არის ასახული გრაფიკზე? </h4><p style='text-indent:10px' >  " +
                " გრაფიკზე ასახულია თუ როგორ იცვლებოდა თქვენი GPA თითოეული ჩაბარებული საგნის  შესაბამისად  </p>",
            html: true
        });
    });

}



Actions.popupContactDeveloper = function() {
    swal({
        title: "",
        text: "<div style='text-align:left;'>   <h4 style='font-weight:bold'>დაუკავშირდით " +
            "<a class='contactTooltip' data-tooltip='გთხოვთ რომ მხოლოდ მომწეროთ, ნუ გამომიგზავნით friend request-ს' target='_blank' " +
            "href='https://www.facebook.com/Davit.Bumbeishvili' > დეველოპერს<a/> </h4>",
        html: true
    });
};



Actions.popupNeedfulPhones = function() {
    swal({
        title: "კონტაქტები",
        text: "<div style='text-align:left;'>   <h4 style='font-weight:bold'>საგამოცდო ცენტრი</h4><p style='text-indent:10px' >   2 18 00 60 , 2 23 39 10 , მეილი - examcenter@tsu.ge  </p>" +
            "<h4 style='font-weight:bold'> კონტაქტები ფაკულტეტების მიხედვით</h4> " +
            "<a target='_blank' href='https://docs.google.com/spreadsheets/d/1AeVjhSn3fyAo40znHTGVaDp8zgf5G18YqAlDbtq9iWM/edit?usp=sharing'> " +
            " <p style='text-indent:10px;color:blue'> • ზუსტების </p> </a>",
        html: true
    })
};

Actions.popupOtherNews = function() {
    swal({
        title: "სხვადასხვა სიახლეები",
        text: "<a style='float:left' target='_blank' href='https://drive.google.com/folderview?id=0B5Xx_P8ocy_bfi1POXNSQy11bXpxOF9pSTdYZVlSaUE0VE5wR0ppR0gyVzQzS2dKUXJrbjA&usp=sharing'> " +
            " <p style='text-indent:10px;color:blue'> • გადმოწერეთ სამაგისტრო გამოცდის ყველა ტესტი </p> </a>",
        html: true
    })
};

Actions.popupHotLinks = function() {
    swal({
        title: "ცხელი ბმულები",
        text: " <ul style='float:left;list-style-type:none'>" +
            "<li > <a style = 'float:left' target='_blank' href='https://www.tsu.ge/ge/government/administration/departments/examcenter/semesterexam/exam_timetable'>• მიმდინარე გამოცდების განრიგი</a></li>" +

            "<li > <a style = 'float:left' target='_blank' href='https://www.tsu.ge/ge/service/time_table/'>• სასწავლო ცხრილები </a></li>" +

            "<li ><a target='_blank' style = 'float:left' href='https://www.tsu.ge/ge/government/administration/departments/study/2014-2015/ui3-_v_ob_qPFMWln/?p=1'>• სასწავლო პროცესის ვადები </a></li>" +
            "</ul>" + "<br><br><br><br>" +


            "<h4 style='font-weight:bold'> სასწავლო მასალები ფაკულტეტების მიხედვით:</h4> " +
            "<a target='_blank' style='float:left' href='https://drive.google.com/folderview?id=0ByNx6iZoJjTjTjlER3l1LVVaUmM&usp=sharing&tid=0By2LY-mb03Veb3RBM1NGemhKOEk'> " +
            " <p style='text-indent:10px;color:blue'> • ზუსტების </p> </a>",
        html: true
    })
};


PageContext.TopButtons.Vacancies.process = function() {

    var vacancionListHtml = "<ul style='float:left;list-style-type:none'>";
    vacancionListHtml += PageContext.TopButtons.Vacancies.getBogVacancyHtml(Global.StudentInfo);
    vacancionListHtml += "</ul>"


    $('#vacancyBadge').html(Global.BadgeNumberCount);
    if(Global.BadgeNumberCount>0){
        $('#btnVacancies').css('background-color','rgb(117, 117, 229)');
        $('.badge').css('color','rgb(117, 117, 229) ');
    }

    var alertText = "<br><br> <a class='vacanciesTooltip' style='float:left' data-tooltip='ამ ბლოკში დაიდება ვაკანსიები, რომელიც გაფილტრული იქნება ფაკულტეტის,კურსის, GPA-ს, რომელიმე საგნის ქულის, მიხედვით. მაგალითად ვაკანსია ვებ-დიზაინერის შესახებ გამოუჩნდებათ მე-4 კურსის კომპიუტერული მეცნიერების სპეციალობის მხოლოდ იმ სტუდენტებს რომელთა GPA>3 და ვებ-დიზაინში მიღებული აქვთ 94 ქულაზე მეტი...' " +
        " > დაწვრილებით...<a/> </h4>";

    alertText = vacancionListHtml + alertText;

    $('#btnVacancies').click(function() {
        swal({
            title: "ვაკანსიები",
            text: alertText,
            html: true
        });
    });
}



Utilities.isAcceptableForVacancy = function(vacancyMinGpa, vacancySemesters,
    vacancySpecialities, vacancySubjectsAndMinPoints) {
    var success = false;
    var studentInfo = Global.StudentInfo;

    // check semester
    for (var i = 0; i < vacancySemesters.length; i++) {
        if (studentInfo.currentSemester == vacancySemesters[i]) {
            success = true;
        }
    }
    if (!success) return false;


    //check for speciality
    success = false;
    for (var i = 0; i < vacancySpecialities.length; i++) {
        if (studentInfo.speciality == vacancySpecialities[i]) {
            success = true;
        }
    }
    if (!success) return false;


    //check for gpa 
    success = false;
    if (studentInfo.gpa >= vacancyMinGpa) success = true;
    if (!success) return false;


    //check for subjects 
    var successCount = 0;
    for (var i = 0; i < Global.StudentGrades.length; i++) {
        for (var j = 0; j < vacancySubjectsAndMinPoints.length; j++) {
            if (Global.StudentGrades[i].subjectName == vacancySubjectsAndMinPoints[j].subjectName) {
                if (Global.StudentGrades[i].point >= vacancySubjectsAndMinPoints[j].minPoint) {
                    successCount++;
                }
            }
        }
    }

    if (successCount != vacancySubjectsAndMinPoints.length) return false;


    return true;
}



PageContext.TopButtons.Vacancies.getBogVacancyHtml = function() {

    var vacancySpecialities = ['კომპიუტერული მეცნიერება'];
    var vacancySemesters = [4, 5, 6, 7 ];
    var vacancySubjectsAndMinPoints = [{
        subjectName: 'ალგორითმები და მონაცემთა სტრუქტურები'.trim(),
        minPoint: 52
    }]
    var vacancyMinGpa = 2.1;

    if (Utilities.isAcceptableForVacancy(vacancyMinGpa, vacancySemesters,
            vacancySpecialities, vacancySubjectsAndMinPoints)) {
        Global.BadgeNumberCount++;
        return "<li><a target='_blank' href='https://goo.gl/TyW7cJ'>• სტაჟირება საქართველოს ბანკში (IT) </a></li>";
    } else return "";
}

App.main();