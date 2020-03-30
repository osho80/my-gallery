console.log('Starting up');

function onInit() {
    renderGallery();
}

function renderGallery(){
    //debugger
    var portfolios = gProjects;
    var strHtmls = portfolios.map(function (portfolio) {
        return `
        <div class="col-md-4 col-sm-6 portfolio-item">
            <a class="portfolio-link" name="${portfolio.id}" onclick="onRenderModal(this)" data-toggle="modal" href="#portfolioModal">
                <div class="portfolio-hover">
                    <div class="portfolio-hover-content">
                        <i class="fa fa-plus fa-3x"></i>
                    </div>
                </div>
                <img class="img-fluid" src="./img/portfolio/${portfolio.id}.jpg" alt="">
            </a>
            <div class="portfolio-caption">
                <h4>${portfolio.name}</h4>
                <p class="text-muted">${portfolio.desc}</p>
            </div>
        </div>`
    });

    $('#portfolios-projs').html(strHtmls.join(''));  
} 


function onRenderModal(portfolioName){
    //debugger
    var portfolio = gProjects.find(function(portfolio) {
        return portfolioName.name === portfolio.id;
    })  

    // console.log('portfolio: ', portfolio);
    // return portfolio
    
    var portfolioModal = 
    // <div class="portfolio-modal modal fade" id="${portfolio.id}Modal" tabindex="-1" role="dialog" aria-hidden="true">
        `<div class="modal-dialog">
            <div class="modal-content">
                <div class="close-modal" data-dismiss="modal">
                    <div class="lr">
                        <div class="rl"></div>
                    </div>
                    </div>
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-8 mx-auto">
                                <div class="modal-body">
                                    <h2>${portfolio.name}</h2>
                                    <p class="item-intro text-muted">${portfolio.title}</p>
                                    <img class="img-fluid d-block mx-auto" src="./img/portfolio/${portfolio.id}.jpg" alt="">
                                    <p>${portfolio.desc}</p>
                                    <ul class="list-inline"> 
                                        <li>Date: March 2020</li>
                                        <li>Client: ${portfolio.client}</li>
                                        <li>Category: ${portfolio.labels}</li>
                                    </ul>
                                    <button class="btn btn-primary" data-dismiss="modal" type="button">
                                        <i class="fa fa-times"></i>
                                        Close Project</button>
                                </div>
                            </div>
                        </div>        
                    </div>         
                </div>
            </div>
        </div>`
    
        console.log(portfolioModal);
        
        $('.portfolio-modal').html(portfolioModal);  
}

function onSubmit() {
    var email = $('#contact-email').val();
    var subject = $('#contact-subject').val();
    var message = $('#contact-message').val();
    var contactStr = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${message}`
    window.open(contactStr);
    // console.log(contactStr);
    // console.log(email);
    // console.log(subject);
    // console.log(message);
    
    
}