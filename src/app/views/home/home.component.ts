import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterLink, Router } from '@angular/router';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AuthService } from '../../services/authservice/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SlickCarouselModule, RouterLink, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AuthService],
})
export class HomeComponent {
  constructor(private router: Router, private authService: AuthService) {}

  slides = [
    {
      img: 'assets/img/profil01.jpg',
      post: 'Software engineer',
      nom: 'Jean Biboum',
      testimonial:
        ' CollabInnovate has revolutionized how we solve problems and innovate in our company. With this intuitive and powerful platform, we have been able to find creative solutions to our most complex challenges.',
    },
    {
      img: 'assets/img/02.jpg',
      post: 'Data Scientist',
      nom: 'Lin Mamarine',
      testimonial:
        ' As a Data Scientist, I really appreciate how CollabInnovate uses artificial intelligence to analyze data and suggest relevant solutions. This has significantly sped up our innovation process.',
    },
    {
      img: 'assets/img/03.jpg',
      post: 'Project Manager',
      nom: 'Naîra Peca',
      testimonial:
        ' CollabInnovate has been a real asset for our team. With its selection and evaluation features, we have been able to quickly identify the best solutions and implement them effectively.',
    },
    {
      img: 'assets/img/04.jpg',
      post: 'UX Designer',
      nom: 'Taza Perez',
      testimonial:
        ' As a UX designer, I have been impressed by the user-friendliness of CollabInnovate is interface. It has allowed our team to collaborate seamlessly and create user-centered solutions.',
    },
    {
      img: 'assets/img/05.jpg',
      post: 'Marketing Specialist',
      nom: 'Hibra Combo',
      testimonial:
        ' CollabInnovate has helped us promote our innovative solutions to a wider audience. Its matchmaking feature has enabled us to find strategic partners and increase our market visibility.',
    },
    {
      img: 'assets/img/06.jpg',
      post: 'Financial Analyst',
      nom: 'Line Pakina',
      testimonial:
        ' CollabInnovate has greatly simplified our process of evaluating innovation projects. With its tracking and evaluation tools, we have been able to measure the financial impact of our initiatives and make informed decisions.',
    },
    {
      img: 'assets/img/08.jpg',
      post: 'Human Resources Manager',
      nom: 'Boukarie Serise',
      testimonial:
        ' CollabInnovate has fostered a culture of innovation within our company. Its community and collaboration features have allowed our employees to share ideas and actively engage in the innovation process.',
    },
    {
      img: 'assets/img/09.jpg',
      post: 'Sales Representative',
      nom: 'Salona Racari',
      testimonial:
        ' As a sales representative, I have been able to identify new business opportunities through the innovative projects featured on CollabInnovate. This has allowed me to strengthen our relationships with clients and increase our sales.',
    },
    {
      img: 'assets/img/11.jpg',
      post: 'IT Support Specialist',
      nom: 'Vanon Chavez',
      testimonial:
        ' CollabInnovate provides exceptional technical support. Its dedicated team is always available to answer our questions and quickly resolve issues. This allows us to fully leverage the platform to support our operations.',
    },
  ];

  slideConfig = {
    slidesToShow: 2,
    slidesToScroll: 1,
    ininite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    prevArrow: '<button type="button" class="slick-prev">Previous</button>',
    nextArrow: '<button type="button" class="slick-next">Next</button>',
    responsive: [
      {
        breakpoint: 1024, // taille de l'écran à partir de laquelle ces paramètres seront utilisés
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 768, // taille de l'écran à partir de laquelle ces paramètres seront utilisés
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

  slickInit(e: any) {
    console.log('slick initialized');
  }

  breakpoint(e: any) {
    console.log('breakpoint');
  }

  afterChange(e: any) {
    console.log('afterChange');
  }

  beforeChange(e: any) {
    console.log('beforeChange');
  }

  gotoservice(path: any) {
    let email = localStorage.getItem('email');

    if(email){
      this.authService.getToken(email).subscribe(
        (response) => {
          if (this.authService.isValidToken(response.message)) {
            this.router.navigate(['/' + path]);
          } else {
              localStorage.setItem('destination', path);
              this.router.navigate(['/' + 'signup']);
          }
        },
        (error) => {
          console.log(error.error.message);
          localStorage.setItem('destination', path);
          this.router.navigate(['/' + 'signup']);
        }
      )
    }else{
      localStorage.setItem('destination', path);
      this.router.navigate(['/' + 'signup']);
    }
  }
}
