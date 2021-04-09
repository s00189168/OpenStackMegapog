import { Component, Input, OnInit } from '@angular/core';
import { GlobalPogStats } from 'src/app/types/pog-stats.type';

@Component({
  selector: 'pog-home-total-stats',
  templateUrl: './home-total-stats.component.html',
  styleUrls: ['./home-total-stats.component.css']
})
export class HomeTotalStatsComponent implements OnInit {
  @Input() pogStats: GlobalPogStats;

  constructor() { }

  ngOnInit(): void {
  }
}
