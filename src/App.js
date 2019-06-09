import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai'; 


const app = new Clarifai.App({
  apiKey: 'e3bd3f40e1e34acd91f6f84d9a6b0de1'
});

const particlesOptions = {
  particles: {
    number: {
      value: 200,
      density: {
        enable: true,
        value_area: 1000
     }
  }
}
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl:'',
      box:{}
    }
  }



  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage'); 
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return{
    leftCol: clarifaiFace.left_col*width,
    topRow: clarifaiFace.top_row*height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height) 
  }
}

  displayFacebox = (box) =>{
    console.log(box);
    this.setState({box: box});
  }


  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onButtonSubmit = () => {
    //console.log(event)
    this.setState({imageUrl: this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(
      response => this.displayFacebox(this.calculateFaceLocation(response)))
     // do something with response
    // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
   .catch (err => console.log(err));
}
  

  render(){
  const { imageUrl,box} = this.state;
  return (
    <div className="App">
     <Particles className='particles'  params={particlesOptions}/>
     <Navigation />
     <Logo />
     <Rank />
     <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
      />
     <FaceRecognition 
                box = {box}
                imageUrl={imageUrl}           
      />
    </div>
  );
}
}

export default App;