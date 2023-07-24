import axios from "axios"
import SlimSelect from 'slim-select'
import _ from "lodash"
import { testyTreatsAPI } from "./tasty-treatsAPI";


const formEl = document.querySelector('.search-filters');

const searchSelectEl = document.querySelector('#search-key');
const timeSelectEl = document.querySelector('#time-key')
const areaSelectElement = document.querySelector('#area-key');
const ingredientsSelectElement = document.querySelector('#ingredients-key');
const resetFiltersEl = document.querySelector('.filter-reset')

const tastyTreatsAPI = new testyTreatsAPI()

let areaSlimSelect = undefined
let timeSlimSelect = undefined
let ingredientSlimSelect = undefined


tastyTreatsAPI.loadAreas()
.then((res) => res.data)
.then((res) => {
    for(let result in res){
        areaSelectElement.insertAdjacentHTML('beforeend',
        `
            <option value="${res[result].name}">${res[result].name}</option>
        `)
    }

    areaSlimSelect = new SlimSelect({
        select : areaSelectElement,
        settings : {
            showSearch : false,
            placeholderText: 'Region',
            allowDeselect: true,
            maxValuesShown: 6,
        }
    })
})


tastyTreatsAPI.loadIngredients()
.then(res => res.data)
.then((res) => {
    for(let result in res){
        ingredientsSelectElement.insertAdjacentHTML('beforeend',
        `
            <option value="${res[result].name}">${res[result].name}</option>
        `)
    }

    ingredientSlimSelect =new SlimSelect({
        select : ingredientsSelectElement,
        settings : {
            showSearch : false,
            placeholderText: 'Product',
            allowDeselect: true,
            maxValuesShown: 6,
        }
    })
})


timeSlimSelect = new SlimSelect({
    select : timeSelectEl,
    settings : {
        showSearch : false,
        placeholderText: '0 min',
        allowDeselect: true,
        maxValuesShown: 6,
    }
})





const recipesReq = async () =>{
    if (searchSelectEl.value.trim() != ''){
        tastyTreatsAPI.title = searchSelectEl.value
    }
    if (timeSelectEl.value != ''){
        tastyTreatsAPI.time = timeSelectEl.value
    }
    if (areaSelectElement.value != ''){
        tastyTreatsAPI.area = areaSelectElement.value
    }
    if(ingredientsSelectElement.value != ''){
        tastyTreatsAPI.ingredient = ingredientsSelectElement.value
    }

    const res = await tastyTreatsAPI.loadRecipes()
    return res.data
}

searchSelectEl.addEventListener('change', _.debounce(() => {
    recipesReq()
}, 300, {leading : false, trailing : true}))

areaSelectElement.addEventListener('change', _.debounce(() => {
    recipesReq()
}, 300, {leading : false, trailing : true}))

ingredientsSelectElement.addEventListener('change', _.debounce(() => {
    recipesReq()
}, 300, {leading : false, trailing : true}))

timeSelectEl.addEventListener('change', _.debounce(() => {
    recipesReq()
}, 300, {leading : false, trailing : true}))

resetFiltersEl.addEventListener('click', () =>{
    areaSlimSelect.setSelected('')
    ingredientSlimSelect.setSelected('')
    timeSlimSelect.setSelected('')
    searchSelectEl.value = ''
})
