function openNav() {
    document.getElementById("mySidenav").style.width = "300px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function hideAnts() {
    let mapDiv = document.getElementById('map');
    let inputChecked = document.getElementById('hideAnts').checked;

    if (inputChecked) {
        mapDiv.className += ' hide-ants';
    } else {
        mapDiv.classList.remove('hide-ants');
    }
}

function hideObstacle() {
    let mapDiv = document.getElementById('map');
    let inputChecked = document.getElementById('hideObstacle').checked;

    if (inputChecked) {
        mapDiv.className += ' hide-obstacle';
    } else {
        mapDiv.classList.remove('hide-obstacle');
    }
}

function hideFood() {
    let mapDiv = document.getElementById('map');
    let inputChecked = document.getElementById('hideFood').checked;

    if (inputChecked) {
        mapDiv.className += ' hide-food';
    } else {
        mapDiv.classList.remove('hide-food');
    }
}

function hideBase() {
    let mapDiv = document.getElementById('map');
    let inputChecked = document.getElementById('hideBase').checked;

    if (inputChecked) {
        mapDiv.className += ' hide-base';
    } else {
        mapDiv.classList.remove('hide-base');
    }
}

function hidePheromone() {
    let mapDiv = document.getElementById('map');
    let inputChecked = document.getElementById('hidePheromone').checked;

    if (inputChecked) {
        mapDiv.className += ' hide-pheromone';
    } else {
        mapDiv.classList.remove('hide-pheromone');
    }
}
