function boutonSkill(name,bclass,awe,cost,balise,title,id,htmlid) {
    if (htmlid === undefined) {
        htmlid = 'unitInfos';
    }
    $('#'+htmlid).append('<span class="blockTitle"><'+balise+'><button type="button" title="'+title+'" class="'+bclass+' skillButtons" id="'+id+'" onmousedown="clicSound()"><i class="'+awe+'"></i> <span class="small">'+cost+'</span></button>&nbsp; '+name+'</'+balise+'></span>');
}

// boutonSkill('Guet',bouton,'fas fa-binoculars',apCost,balise,'Faire le guet (pas de malus à la riposte)','boutonGuet');
// document.getElementById("boutonGuet").addEventListener("click", guet);
