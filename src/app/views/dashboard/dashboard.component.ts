import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, OnInit, Renderer2, WritableSignal, effect, inject, signal } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import { HeaderComponent } from '../../layout';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}

