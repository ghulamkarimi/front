"use client";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const CarouselItem = [
  {
    id: 1,
    title: "A & O Team",
    description: "Beste Wahl für Ihr Auto",
    image: "/logoCarousel.webp",
  },
  {
    id: 2,
    title: " Reifen, Service, ...",
    description: "Beste Angebote für Sie",
    image: "/reifenCarousel.png",
  },
  {
    id: 3,
    title: "Auto Service",
    description: " Wir bieten Ihnen den besten Service",
    image: "/werkzeug.jpeg",
  },
];

const HomeCarouselHero = () => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="w-full pt-10">
      <Carousel
        responsive={responsive}
        swipeable={true}
        className="w-full h-[600px]"
        showDots={true}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={5000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        {CarouselItem.map((item) => (
          <div key={item.id} className="relative w-full h-[600px]">
            <img className="w-full h-full object-cover" src={item.image} alt={item.title} />
            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white p-4">
              <h2 className="text-4xl font-bold mb-2">{item.title}</h2>
              <p className="text-xl font-bold">{item.description}</p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HomeCarouselHero;
