const characterStatusList    = document.querySelectorAll('.character-status');
const characterImageList     = document.querySelectorAll('.character-image');
const characterNameList      = document.querySelectorAll('.character-name');
const characterDimensionList = document.querySelectorAll('.character-dimension');
const buttonPrevList         = document.querySelectorAll('.button-container__prev');
const buttonNextList         = document.querySelectorAll('.button-container__next');

const API_URL = 'https://rickandmortyapi.com/api/character/';
const CHARACTERS_BY_PAGE = 12;
const BASE_CHARACTER = {status: 'None', image: 'none', name: 'None', species: 'None'};

var characterListId = new Array(CHARACTERS_BY_PAGE).fill(0).map( (val,ndx) => ndx+1);
var lastCharacterId = Infinity; //This is important to stop the search


function fetchData(urlApi){
    return new Promise( (resolve, reject) =>{
        $.
        get(urlApi, (data) => {
            resolve(data);
        })
        .fail(reject);
    });
}

function showCharacterInfo(characterList){/*--- */
    for(let i=0 ; i<characterList.length ; i++){
        characterStatusList[i].innerHTML = characterList[i].status;
        addColorToStatus(characterStatusList[i], characterList[i]);

        characterImageList[i].style.backgroundImage = `url(${characterList[i].image})`;
        characterNameList[i].innerHTML = characterList[i].name;
        characterDimensionList[i].innerHTML = characterList[i].species;
    }
}

function addColorToStatus(characterStatus,{status}){
    if(characterStatus.classList.length === 2){
        let lastStatus = characterStatus.classList[1];
        characterStatus.classList.remove(lastStatus);
    }
    characterStatus.classList.add(`character-status--${status.toLowerCase()}`);
}

function nextIdsInTheList(){
    if(!characterListId.some( val => val === lastCharacterId)){
        characterListId = characterListId.map( id => id+CHARACTERS_BY_PAGE);
    }
}

function prevIdsInTheList(){
    if(characterListId[0] > CHARACTERS_BY_PAGE){
        characterListId = characterListId.map( id => id-CHARACTERS_BY_PAGE);
    }
}

function toTheNextPage(){
    nextIdsInTheList();
    startThePage();
}

function toThePrevPage(){
    prevIdsInTheList();
    startThePage();
}

async function startThePage(){/*-- */
    let characterList = null;
    try{
        characterList = await fetchData(`${API_URL}${characterListId}`);
        characterList = await fillCharacterListEmptySpace(characterList); //If is needed
        showCharacterInfo(characterList);
    }catch(error){
        console.error(new Error(`${error}`));
    }
}

function addTheListenerToTheButtons(){
    for(let button of buttonPrevList){
        button.addEventListener('click',toThePrevPage);
    }

    for(let button of buttonNextList){
        button.addEventListener('click',toTheNextPage);
    }
}

async function getTheLastCharacterId(){
    try{
        let dataFromServer = await fetchData(API_URL);
        lastCharacterId = dataFromServer.info.count;
    }catch(error){
        console.error(new Error(`${error}`));
    }
}

function fillCharacterListEmptySpace(characterList){/*--- */
    if(characterList.length < CHARACTERS_BY_PAGE){
        characterList.push(...new Array(CHARACTERS_BY_PAGE - characterList.length).fill(BASE_CHARACTER));
    }
    return characterList;
}

/**-------START MAIN PROGRAM-------*/
getTheLastCharacterId();
addTheListenerToTheButtons();
startThePage();