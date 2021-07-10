var btx = document.getElementById("myChart").getContext("2d");
var btx2 = document.getElementById("myChart2").getContext("2d");
var btx3 = document.getElementById("myChart3").getContext("2d");

var ctx = document.getElementById("myChart4").getContext("2d");
var ctx2 = document.getElementById("myChart5").getContext("2d");
var ctx3 = document.getElementById("myChart6").getContext("2d");
var dtx = document.getElementById("myChart7").getContext("2d");



 new Chart(btx, {
  type: 'line',
  data: {
    labels: ['Session ' + 1,' ' ,' ' ,' ','Session ' + 5,' ' ,' ',' ',' ','Session ' + 10,' ' ,' ' ,' ',' ','Session ' + 15,' ',' ',' ',' ','Session ' + 20],
    datasets: [{
      data: [10,2,45,5,34,24,12,16,1,78,11,12,78,7,8,9,0,1,2,3],
      label: "Patient 1",
      borderColor: "#3e95cd",
      fill: false
    }, {
      data: [1,2,5,1,5,6,1,4,6,9,0,2,8,7,1,6,4,3,1,2],
      label: "Patient 2",
      borderColor: "#8e5ea2",
      fill: false
    }, {
      data: [1,4,5,5,14,24,2,6,1,12,9,1,5,3,1,1,1,1,1,3],
      label: "Patient 3",
      borderColor: "#3cba9f",
      fill: false
    }, {
      data: [10,2,45,5,34,24,12,16,1,78,11,12,78,7,8,9,0,1,2,3],
      label: "Patient 4",
      borderColor: "#e8c3b9",
      fill: false
    }, {
      data: [3,7,45,5,24,24,12,16,1,8,11,12,78,7,2,9,4,1,2,3],
      label: "Patient 5",
      borderColor: "#c45850",
      fill: false
    }, {
      data: [1,3,4,7,8,9,2,4,15,11,4,1,8,9,7,6,3,7,1,5],
      label: "Patient 6",
      borderColor: "##e5eb34",
      fill: false
    }, {
      data: [5,4,5,5,3,2,2,6,1,8,1,1,8,9,3,5,3,4,6,4],
      label: "Patient 7",
      borderColor: "#34eb5f",
      fill: false
    },
     {
      data: [2,6,2,6,3,2,6,5,6,7,21,6,8,3,5,4,3,1,4,6],
      label: "Patient 8",
      borderColor: "#3452eb",
      fill: false
    },
    {
      data: [6,5,2,4,5,2,4,5,7,8,9,1,9,2,3,5,8,2,1,2],
      label: "Patient 9",
      borderColor: "#8334eb",
      fill: false
    },
    {
      data: [1,3,4,5,3,3,5,6,3,5,6,2,2,6,4,7,8,2,1,9],
      label: "Patient 10",
      borderColor: "#eb34eb",
      fill: false
    },
    {
      data: [5,1,3,6,2,5,7,7,5,8,1,4,8,8,8,4,1,7,3,7],
      label: "Patient 11",
      borderColor: "#eb345f",
      fill: false
    },
    {
      data: [12,5,7,5,4,2,1,8,9,2,1,5,7,7,9,1,3,5,5,3],
      label: "Patient 12",
      borderColor: "#663300",
      fill: false
    },
    {
      data: [9,4,10,5,2,4,12,5,8,8,3,1,7,9,2,6,2,12,2,6],
      label: "Patient 13",
      borderColor: "#999966",
      fill: false
    },
    {
      data: [6,2,1,4,6,3,6,7,3,7,12,9,8,5,3,7,8,3,2,1],
      label: "Patient 14",
      borderColor: "#800000",
      fill: false
    },
    {
      data: [1,2,12,3,5,6,4,3,8,3,8,4,3,8,5,1,5,6,2],
      label: "Patient 15",
      borderColor: "#404040",
      fill: false
    }
    ]
  },
  options: {
    title: {
      display: true,
      text: 'ss'
    }
  }
});

 new Chart(btx2, {
 type: 'line',
  data: {
    labels: ['Session ' + 1,' ' ,' ' ,' ','Session ' + 5,' ' ,' ',' ',' ','Session ' + 10,' ' ,' ' ,' ',' ','Session ' + 15,' ',' ',' ',' ','Session ' + 20],
    datasets: [{
      data: [3,2,4,5,5,4,6,12,1,2,11],
      label: "Patient 1",
      borderColor: "#3e95cd",
      fill: false
    }, {
      data: [1,2,5,1,5,6,1,4,6,9,0,2,8,7,1,6,4,3,1,2],
      label: "Patient 2",
      borderColor: "#8e5ea2",
      fill: false
    }, {
      data: [1,4,5,5,4,4,2,6,11,1,1,1,3],
      label: "Patient 3",
      borderColor: "#3cba9f",
      fill: false
    }, {
      data: [6,2,6,5,2,5,1,4,1,2,11,12,5,7,8],
      label: "Patient 4",
      borderColor: "#e8c3b9",
      fill: false
    }, {
      data: [3,7,4,5,2,4,2,1,1,8,7,12,4,7,2,9,4,1,2,3],
      label: "Patient 5",
      borderColor: "#c45850",
      fill: false
    }, {
      data: [1,3,4,7,8,9,2,4,3,11,4,1,8,9,7,6,3,7,1,5],
      label: "Patient 6",
      borderColor: "##e5eb34",
      fill: false
    }, {
      data: [5,4,5,5,3,2,2,6,1,8,1,1,8,9,3,5,3,4,6,4],
      label: "Patient 7",
      borderColor: "#34eb5f",
      fill: false
    },
     {
      data: [2,6,2,6,3,2,6,5,6,7,2,6,8,3,5,4,3,1,4,6],
      label: "Patient 8",
      borderColor: "#3452eb",
      fill: false
    },
    {
      data: [6,5,2,4,5,2,4,5,7,8,9,1,9,2,3,5,8,2,1,2],
      label: "Patient 9",
      borderColor: "#8334eb",
      fill: false
    },
    {
      data: [1,3,4,5,3,3,5,6,3,5,6,2,2,6,4,7,8,2,1,9],
      label: "Patient 10",
      borderColor: "#eb34eb",
      fill: false
    },
    {
      data: [5,1,3,6,2,5,7,7,5,8,1,4,8,8,8,4,1,7,3,7],
      label: "Patient 11",
      borderColor: "#eb345f",
      fill: false
    },
    {
      data: [12,5,7,5,4,2,1,8,9,2,1,5,7,7,9,1,3,5,5,3],
      label: "Patient 12",
      borderColor: "#663300",
      fill: false
    },
    {
      data: [9,4,10,5,2,4,12,5,8,8,3,1,7,9,2,6,2,12,2,6],
      label: "Patient 13",
      borderColor: "#999966",
      fill: false
    },
    {
      data: [6,2,1,4,6,3,6,7,3,7,12,9,8,5,3,7,8,3,2,1],
      label: "Patient 14",
      borderColor: "#800000",
      fill: false
    },
    {
      data: [1,2,12,3,5,6,4,3,8,3,8,4,3,8,5,1,5,6,2],
      label: "Patient 15",
      borderColor: "#404040",
      fill: false
    }
    ]
  },
  options: {
    title: {
      display: true,
      text: 'ss'
    }
  }
});

 new Chart(btx3, {
 type: 'line',
  data: {
    labels: ['Session ' + 1,' ' ,' ' ,' ','Session ' + 5,' ' ,' ',' ',' ','Session ' + 10,' ' ,' ' ,' ',' ','Session ' + 15,' ',' ',' ',' ','Session ' + 20],
    datasets: [{
      data: [0, 0, 0, 3,2,4,5,5,4,6,0,1,2,2],
      label: "Patient 1",
      borderColor: "#3e95cd",
      fill: false
    }, {
      data: [1,2,5,1,5,0,1,4,6,3,0,2,0,7,1,6,4,3,1,2],
      label: "Patient 2",
      borderColor: "#8e5ea2",
      fill: false
    }, {
      data: [1,1,5,5,4,4,2,6,1,1,1,1,3],
      label: "Patient 3",
      borderColor: "#3cba9f",
      fill: false
    }, {
      data: [4,2,4,4,2,5,1,2,1,2,1,0,5,7,8],
      label: "Patient 4",
      borderColor: "#e8c3b9",
      fill: false
    }, {
      data: [3,2,4,5,2,4,2,1,1,8,0,0,4,7,2,9,4,1,2,3],
      label: "Patient 5",
      borderColor: "#c45850",
      fill: false
    }, {
      data: [1,3,4,0,0,0,2,4,3,0,4,1,0,2,0,6,3,7,1,5],
      label: "Patient 6",
      borderColor: "##e5eb34",
      fill: false
    }, {
      data: [5,4,5,5,3,2,2,6,1,0,1,1,8,0,3,5,3,4,6,4],
      label: "Patient 7",
      borderColor: "#34eb5f",
      fill: false
    },
     {
      data: [2,6,2,6,3,2,6,5,6,7,2,6,8,3,5,4,3,1,4,6],
      label: "Patient 8",
      borderColor: "#3452eb",
      fill: false
    },
    {
      data: [6,5,2,4,5,2,4,5,7,8,9,1,9,2,3,5,8,2,1,2],
      label: "Patient 9",
      borderColor: "#8334eb",
      fill: false
    },
    {
      data: [1,3,4,5,3,3,5,6,3,5,6,2,2,6,4,7,8,2,1,9],
      label: "Patient 10",
      borderColor: "#eb34eb",
      fill: false
    },
    {
      data: [5,1,3,6,2,5,7,7,5,0,1,4,8,8,8,4,1,7,3,7],
      label: "Patient 11",
      borderColor: "#eb345f",
      fill: false
    },
    {
      data: [0,5,7,5,4,2,1,8,9,2,1,5,7,7,9,1,3,5,5,3],
      label: "Patient 12",
      borderColor: "#663300",
      fill: false
    },
    {
      data: [9,4,0,5,2,4,0,5,0,0,3,1,7,9,2,6,2,0,2,6],
      label: "Patient 13",
      borderColor: "#999966",
      fill: false
    },
    {
      data: [6,2,1,4,0,3,6,0,3,7,0,9,8,5,3,7,8,3,2,1],
      label: "Patient 14",
      borderColor: "#800000",
      fill: false
    },
    {
      data: [1,2,0,3,5,6,4,3,2,0,0,4,3,8,5,1,5,6,2],
      label: "Patient 15",
      borderColor: "#404040",
      fill: false
    }
    ]
  },
  options: {
    title: {
      display: true,
      text: 'ss'
    }
  }
});


 new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Session ' + 1,' ' ,' ' ,' ','Session ' + 5,' ' ,' ',' ',' ','Session ' + 10,' ' ,' ' ,' ',' ','Session ' + 15,' ',' ',' ',' ','Session ' + 20],
    datasets: [{
      data: [10,2,45,5,34,24,12,16,1,78,11,12,78,7,8,9,0,1,2,3],
      label: "Patient 1",
      borderColor: "#3e95cd",
      fill: false
    }, {
      data: [1,2,5,1,5,6,1,4,6,9,0,2,8,7,1,6,4,3,1,2],
      label: "Patient 2",
      borderColor: "#8e5ea2",
      fill: false
    }, {
      data: [1,4,5,5,14,24,2,6,1,12,9,1,5,3,1,1,1,1,1,3],
      label: "Patient 3",
      borderColor: "#3cba9f",
      fill: false
    }, {
      data: [10,2,45,5,34,24,12,16,1,78,11,12,78,7,8,9,0,1,2,3],
      label: "Patient 4",
      borderColor: "#e8c3b9",
      fill: false
    }, {
      data: [3,7,45,5,24,24,12,16,1,8,11,12,78,7,2,9,4,1,2,3],
      label: "Patient 5",
      borderColor: "#c45850",
      fill: false
    }, {
      data: [1,3,4,7,8,9,2,4,15,11,4,1,8,9,7,6,3,7,1,5],
      label: "Patient 6",
      borderColor: "##e5eb34",
      fill: false
    }, {
      data: [5,4,5,5,3,2,2,6,1,8,1,1,8,9,3,5,3,4,6,4],
      label: "Patient 7",
      borderColor: "#34eb5f",
      fill: false
    },
     {
      data: [2,6,2,6,3,2,6,5,6,7,21,6,8,3,5,4,3,1,4,6],
      label: "Patient 8",
      borderColor: "#3452eb",
      fill: false
    },
    {
      data: [6,5,2,4,5,2,4,5,7,8,9,1,9,2,3,5,8,2,1,2],
      label: "Patient 9",
      borderColor: "#8334eb",
      fill: false
    },
    {
      data: [1,3,4,5,3,3,5,6,3,5,6,2,2,6,4,7,8,2,1,9],
      label: "Patient 10",
      borderColor: "#eb34eb",
      fill: false
    },
    {
      data: [5,1,3,6,2,5,7,7,5,8,1,4,8,8,8,4,1,7,3,7],
      label: "Patient 11",
      borderColor: "#eb345f",
      fill: false
    },
    {
      data: [12,5,7,5,4,2,1,8,9,2,1,5,7,7,9,1,3,5,5,3],
      label: "Patient 12",
      borderColor: "#663300",
      fill: false
    },
    {
      data: [9,4,10,5,2,4,12,5,8,8,3,1,7,9,2,6,2,12,2,6],
      label: "Patient 13",
      borderColor: "#999966",
      fill: false
    },
    {
      data: [6,2,1,4,6,3,6,7,3,7,12,9,8,5,3,7,8,3,2,1],
      label: "Patient 14",
      borderColor: "#800000",
      fill: false
    },
    {
      data: [1,2,12,3,5,6,4,3,8,3,8,4,3,8,5,1,5,6,2],
      label: "Patient 15",
      borderColor: "#404040",
      fill: false
    }
    ]
  },
  options: {
    title: {
      display: true,
      text: 'ss'
    }
  }
});

 new Chart(ctx2, {
 type: 'line',
  data: {
    labels: ['Session ' + 1,' ' ,' ' ,' ','Session ' + 5,' ' ,' ',' ',' ','Session ' + 10,' ' ,' ' ,' ',' ','Session ' + 15,' ',' ',' ',' ','Session ' + 20],
    datasets: [{
      data: [3,2,4,5,5,4,6,12,1,2,11],
      label: "Patient 1",
      borderColor: "#3e95cd",
      fill: false
    }, {
      data: [1,2,5,1,5,6,1,4,6,9,0,2,8,7,1,6,4,3,1,2],
      label: "Patient 2",
      borderColor: "#8e5ea2",
      fill: false
    }, {
      data: [1,4,5,5,4,4,2,6,11,1,1,1,3],
      label: "Patient 3",
      borderColor: "#3cba9f",
      fill: false
    }, {
      data: [6,2,6,5,2,5,1,4,1,2,11,12,5,7,8],
      label: "Patient 4",
      borderColor: "#e8c3b9",
      fill: false
    }, {
      data: [3,7,4,5,2,4,2,1,1,8,7,12,4,7,2,9,4,1,2,3],
      label: "Patient 5",
      borderColor: "#c45850",
      fill: false
    }, {
      data: [1,3,4,7,8,9,2,4,3,11,4,1,8,9,7,6,3,7,1,5],
      label: "Patient 6",
      borderColor: "##e5eb34",
      fill: false
    }, {
      data: [5,4,5,5,3,2,2,6,1,8,1,1,8,9,3,5,3,4,6,4],
      label: "Patient 7",
      borderColor: "#34eb5f",
      fill: false
    },
     {
      data: [2,6,2,6,3,2,6,5,6,7,2,6,8,3,5,4,3,1,4,6],
      label: "Patient 8",
      borderColor: "#3452eb",
      fill: false
    },
    {
      data: [6,5,2,4,5,2,4,5,7,8,9,1,9,2,3,5,8,2,1,2],
      label: "Patient 9",
      borderColor: "#8334eb",
      fill: false
    },
    {
      data: [1,3,4,5,3,3,5,6,3,5,6,2,2,6,4,7,8,2,1,9],
      label: "Patient 10",
      borderColor: "#eb34eb",
      fill: false
    },
    {
      data: [5,1,3,6,2,5,7,7,5,8,1,4,8,8,8,4,1,7,3,7],
      label: "Patient 11",
      borderColor: "#eb345f",
      fill: false
    },
    {
      data: [12,5,7,5,4,2,1,8,9,2,1,5,7,7,9,1,3,5,5,3],
      label: "Patient 12",
      borderColor: "#663300",
      fill: false
    },
    {
      data: [9,4,10,5,2,4,12,5,8,8,3,1,7,9,2,6,2,12,2,6],
      label: "Patient 13",
      borderColor: "#999966",
      fill: false
    },
    {
      data: [6,2,1,4,6,3,6,7,3,7,12,9,8,5,3,7,8,3,2,1],
      label: "Patient 14",
      borderColor: "#800000",
      fill: false
    },
    {
      data: [1,2,12,3,5,6,4,3,8,3,8,4,3,8,5,1,5,6,2],
      label: "Patient 15",
      borderColor: "#404040",
      fill: false
    }
    ]
  },
  options: {
    title: {
      display: true,
      text: 'ss'
    }
  }
});

 new Chart(ctx3, {
 type: 'line',
  data: {
    labels: ['Session ' + 1,' ' ,' ' ,' ','Session ' + 5,' ' ,' ',' ',' ','Session ' + 10,' ' ,' ' ,' ',' ','Session ' + 15,' ',' ',' ',' ','Session ' + 20],
    datasets: [{
      data: [0, 0, 0, 3,2,4,5,5,4,6,0,1,2,2],
      label: "Patient 1",
      borderColor: "#3e95cd",
      fill: false
    }, {
      data: [1,2,5,1,5,0,1,4,6,3,0,2,0,7,1,6,4,3,1,2],
      label: "Patient 2",
      borderColor: "#8e5ea2",
      fill: false
    }, {
      data: [1,1,5,5,4,4,2,6,1,1,1,1,3],
      label: "Patient 3",
      borderColor: "#3cba9f",
      fill: false
    }, {
      data: [4,2,4,4,2,5,1,2,1,2,1,0,5,7,8],
      label: "Patient 4",
      borderColor: "#e8c3b9",
      fill: false
    }, {
      data: [3,2,4,5,2,4,2,1,1,8,0,0,4,7,2,9,4,1,2,3],
      label: "Patient 5",
      borderColor: "#c45850",
      fill: false
    }, {
      data: [1,3,4,0,0,0,2,4,3,0,4,1,0,2,0,6,3,7,1,5],
      label: "Patient 6",
      borderColor: "##e5eb34",
      fill: false
    }, {
      data: [5,4,5,5,3,2,2,6,1,0,1,1,8,0,3,5,3,4,6,4],
      label: "Patient 7",
      borderColor: "#34eb5f",
      fill: false
    },
     {
      data: [2,6,2,6,3,2,6,5,6,7,2,6,8,3,5,4,3,1,4,6],
      label: "Patient 8",
      borderColor: "#3452eb",
      fill: false
    },
    {
      data: [6,5,2,4,5,2,4,5,7,8,9,1,9,2,3,5,8,2,1,2],
      label: "Patient 9",
      borderColor: "#8334eb",
      fill: false
    },
    {
      data: [1,3,4,5,3,3,5,6,3,5,6,2,2,6,4,7,8,2,1,9],
      label: "Patient 10",
      borderColor: "#eb34eb",
      fill: false
    },
    {
      data: [5,1,3,6,2,5,7,7,5,0,1,4,8,8,8,4,1,7,3,7],
      label: "Patient 11",
      borderColor: "#eb345f",
      fill: false
    },
    {
      data: [0,5,7,5,4,2,1,8,9,2,1,5,7,7,9,1,3,5,5,3],
      label: "Patient 12",
      borderColor: "#663300",
      fill: false
    },
    {
      data: [9,4,0,5,2,4,0,5,0,0,3,1,7,9,2,6,2,0,2,6],
      label: "Patient 13",
      borderColor: "#999966",
      fill: false
    },
    {
      data: [6,2,1,4,0,3,6,0,3,7,0,9,8,5,3,7,8,3,2,1],
      label: "Patient 14",
      borderColor: "#800000",
      fill: false
    },
    {
      data: [1,2,0,3,5,6,4,3,2,0,0,4,3,8,5,1,5,6,2],
      label: "Patient 15",
      borderColor: "#404040",
      fill: false
    }
    ]
  },
  options: {
    title: {
      display: true,
      text: 'ss'
    }
  }
});

 new Chart(dtx, {
 type: 'line',
  data: {
    labels: ['Session ' + 1,' ' ,' ' ,' ','Session ' + 5,' ' ,' ',' ',' ','Session ' + 10,' ' ,' ' ,' ',' ','Session ' + 15,' ',' ',' ',' ','Session ' + 20],
    datasets: [{
      data: [0, 0, 0, 3,2,4,5,5,4,6,0,1,2,2],
      label: "Patient 1",
      borderColor: "#3e95cd",
      fill: false
    }, {
      data: [1,2,5,1,5,0,1,4,6,3,0,2,0,7,1,6,4,3,1,2],
      label: "Patient 2",
      borderColor: "#8e5ea2",
      fill: false
    }, {
      data: [1,1,5,5,4,4,2,6,1,1,1,1,3],
      label: "Patient 3",
      borderColor: "#3cba9f",
      fill: false
    }, {
      data: [4,2,4,4,2,5,1,2,1,2,1,0,5,7,8],
      label: "Patient 4",
      borderColor: "#e8c3b9",
      fill: false
    }, {
      data: [3,2,4,5,2,4,2,1,1,8,0,0,4,7,2,9,4,1,2,3],
      label: "Patient 5",
      borderColor: "#c45850",
      fill: false
    }, {
      data: [1,3,4,0,0,0,2,4,3,0,4,1,0,2,0,6,3,7,1,5],
      label: "Patient 6",
      borderColor: "##e5eb34",
      fill: false
    }, {
      data: [5,4,5,5,3,2,2,6,1,0,1,1,8,0,3,5,3,4,6,4],
      label: "Patient 7",
      borderColor: "#34eb5f",
      fill: false
    },
     {
      data: [2,6,2,6,3,2,6,5,6,7,2,6,8,3,5,4,3,1,4,6],
      label: "Patient 8",
      borderColor: "#3452eb",
      fill: false
    },
    {
      data: [6,5,2,4,5,2,4,5,7,8,9,1,9,2,3,5,8,2,1,2],
      label: "Patient 9",
      borderColor: "#8334eb",
      fill: false
    },
    {
      data: [1,3,4,5,3,3,5,6,3,5,6,2,2,6,4,7,8,2,1,9],
      label: "Patient 10",
      borderColor: "#eb34eb",
      fill: false
    },
    {
      data: [5,1,3,6,2,5,7,7,5,0,1,4,8,8,8,4,1,7,3,7],
      label: "Patient 11",
      borderColor: "#eb345f",
      fill: false
    },
    {
      data: [0,5,7,5,4,2,1,8,9,2,1,5,7,7,9,1,3,5,5,3],
      label: "Patient 12",
      borderColor: "#663300",
      fill: false
    },
    {
      data: [9,4,0,5,2,4,0,5,0,0,3,1,7,9,2,6,2,0,2,6],
      label: "Patient 13",
      borderColor: "#999966",
      fill: false
    },
    {
      data: [6,2,1,4,0,3,6,0,3,7,0,9,8,5,3,7,8,3,2,1],
      label: "Patient 14",
      borderColor: "#800000",
      fill: false
    },
    {
      data: [1,2,0,3,5,6,4,3,2,0,0,4,3,8,5,1,5,6,2],
      label: "Patient 15",
      borderColor: "#404040",
      fill: false
    }
    ]
  },
  options: {
    title: {
      display: true,
      text: 'ss'
    }
  }
});


