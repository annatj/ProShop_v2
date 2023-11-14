import {Carousel,Image} from 'react-bootstrap'
import carousel1 from '../assets/carousel1.jpg'
import carousel2 from '../assets/carousel2.jpg'
import carousel3 from '../assets/carousel3.png'

const ProductCarousel = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <Image src={carousel1} style={{width:'1500px',height:'500px'}} />
       
      </Carousel.Item>
      <Carousel.Item>
         <Image src={carousel2} style={{width:'1500px',height:'500px'}} />
       
      </Carousel.Item>
      <Carousel.Item>
         <Image src={carousel3} style={{width:'1500px',height:'500px'}}/>
       
      </Carousel.Item>
    </Carousel>
  );
}
export default ProductCarousel;