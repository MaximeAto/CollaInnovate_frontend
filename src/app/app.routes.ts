import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'profil',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./views/home/home.component').then(m => m.HomeComponent),
    data: {
      title: 'home'
    }
  },
  {
    path: 'signin',
    loadComponent: () => import('./views/pages/signin/signin.component' ).then(m => m.SigninComponent),
    data: {
      title: 'Sign In'
    }
  },
  {
    path: 'signup',
    loadComponent: () => import('./views/pages/signup/signup.component').then(m => m.SignupComponent),
    data: {
      title: 'Sign Up'
    }
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./views/dashboard/dashboard.component').then(m => m.DashboardComponent),
    data: {
      title: 'Sign Up'
    }
  },
  {
    path: 'addproblem',
    loadComponent: () => import('./views/addproblem/addproblem.component').then(m => m.AddproblemComponent),
    data: {
      title: 'Add problem'
    }
  },
  {
    path: 'addsolution/:problem',
    loadComponent: () => import('./views/addsolution/addsolution.component').then(m => m.AddsolutionComponent),
    data: {
      title: 'Add solution'
    }
  },
  {
    path: 'problems',
    loadComponent: () => import('./views/problems/problems.component').then(m => m.ProblemsComponent),
    data: {
      title: 'problems'
    }
  },
  {
    path : 'problem/:problem',
    loadComponent: () => import('./views/problem/problem.component').then(m => m.ProblemComponent),
    data: {
      title: 'problem'
    }
  },
  {
    path : 'solution/:solution',
    loadComponent: () => import('./views/solution/solution.component').then(m => m.SolutionComponent),
    data: {
      title: 'solution'
    }
  },
  {
    path : 'solutions/:problem',
    loadComponent: () => import('./views/solutions/solutions.component').then(m => m.SolutionsComponent),
    data: {
      title: 'solutions'
    }
  },
  {
    path : 'confirmmail',
    loadComponent: () => import('./views/pages/confirmmail/confirmmail.component').then(m => m.ConfirmmailComponent),
    data: {
      title: 'confirmmail'
    }
  },
  {
    path : 'resetpassword',
    loadComponent: () => import('./views/pages/forgetpassword/forgetpassword.component').then(m => m.ForgetpasswordComponent),
    data: {
      title: 'reset-password'
    }
  },
  {
    path : 'mysolutions',
    loadComponent: () => import('./views/mysolutions/mysolutions.component').then(m => m.MysolutionsComponent),
    data: {
      title: 'my-solutions'
    }
  },
  {
    path : 'contributions',
    loadComponent: () => import('./views/contributions/contributions.component').then(m => m.ContributionsComponent),
    data: {
      title: 'contributions'
    }
  },
  {
    path : 'profil',
    loadComponent: () => import('./views/pages/profil/profil.component').then(m => m.ProfilComponent),
    data: {
      title: 'profil'
    }
  },

];
