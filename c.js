var swiper = new Swiper('.swiper', {
    slidesPerView: 3,
    spaceBetween: 5,
    loop: true,
    autoplay: {
        delay:2000,
        disableOnInteraction:false,
    },
    pagination :{
        el:".swiper-pagination",
        clickable:true,
    },
    
   scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
    },
    breakpoints: {
        768: { slidesPerView: 3 },
        480: { slidesPerView: 1 }
    }
});


//modal img js 
var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var images = document.getElementsByClassName("myImg");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

for(var i=0;i < images.length;i++){
   var img = images[i];
img.onclick = function(){
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
}
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
