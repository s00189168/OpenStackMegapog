import { Component, ElementRef, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';

import { GlobalPogStats } from '../../types/pog-stats.type';

@Component({
  selector: 'pog-stats-chart',
  template: `
    <div class="container-fluid px-4 py-3 mb-4">
      <div class="row align-items-start">
        <div class="col-12 home-total-stats-header pt-3 align-items-center">
          <h2>Pog Breakdown</h2>
        </div>
      </div>
      <div class="row align-items-start">
        <div class="linechart"></div>
      </div>
    </div>
  `,
  styleUrls: ['./pog-stats-chart.component.css']
})
export class PogStatsChartComponent implements OnChanges {
  private width = 700;
  private height = 700;
  private margin = 50;
  public svg;
  public svgInner;
  public yScale;
  public xScale;
  public xAxis;
  public yAxis;
  public lineGroupPog;
  public lineGroupPogchamp;
  public lineGroupPogu;
  public lineGroupPoggers;

  mappedStats = null;

  @Input() pogStats: GlobalPogStats;

  public constructor(public chartElem: ElementRef) {}

  ngOnChanges(changes): void {
    if (changes.pogStats?.currentValue && this.pogStats) {
      this.mappedStats = this.mapPogStagsToChartData(this.pogStats);
      this.svg = null;

      this.initializeChart();
      this.drawChart();

      window.addEventListener('resize', () => this.drawChart());
    }
  }

  private initializeChart(): void {
    const mappedToValue = this.mappedStats.map(stats => {
      const { pog, pogchamp, pogu, poggers } = stats;

      return [{ value: pog.value || 0, }, { value: pogchamp.value || 0, }, { value: pogu.value || 0, }, { value: poggers.value || 0, }];
    }).reduce((acc, array) => ([...acc, ...array]), []);

    const dates = this.mappedStats.map(stats => {
      const { pog, pogchamp, pogu, poggers } = stats;

      return [pog, pogchamp, pogu, poggers];
    }).reduce((acc, array) => ([...acc, ...array]), []);

    this.svg = d3
      .select(this.chartElem.nativeElement)
      .select('.linechart')
      .append('svg')
      .attr('height', this.height);
    this.svgInner = this.svg
      .append('g')
      .style('transform', 'translate(' + this.margin + 'px, ' + this.margin + 'px)');

    this.yScale = d3
      .scaleLinear()
      .domain([d3.max(mappedToValue, d => parseInt(d["value"])) + 1, d3.min(mappedToValue, d => parseInt(d["value"])) - 1])
      .range([0, this.height - 2 * this.margin]);

    this.yAxis = this.svgInner
      .append('g')
      .attr('id', 'y-axis')
      .style('transform', 'translate(' + this.margin + 'px,  0)');

    this.xScale = d3.scaleTime().domain(d3.extent(dates, d => new Date(d["date"])));

    this.xAxis = this.svgInner
      .append('g')
      .attr('id', 'x-axis')
      .style('transform', 'translate(0, ' + (this.height - 2 * this.margin) + 'px)');

    this.lineGroupPog = this.svgInner
      .append('g')
      .append('path')
      .attr('id', 'line')
      .style('fill', 'none')
      .style('stroke', 'red')
      .style('stroke-width', '2px');

    this.lineGroupPogchamp = this.svgInner
      .append('g')
      .append('path')
      .attr('id', 'line')
      .style('fill', 'none')
      .style('stroke', 'blue')
      .style('stroke-width', '2px');

    this.lineGroupPogu = this.svgInner
      .append('g')
      .append('path')
      .attr('id', 'line')
      .style('fill', 'none')
      .style('stroke', 'purple')
      .style('stroke-width', '2px');

    this.lineGroupPoggers = this.svgInner
      .append('g')
      .append('path')
      .attr('id', 'line')
      .style('fill', 'none')
      .style('stroke', 'orange')
      .style('stroke-width', '2px');
  }

  private drawChart(): void {
    this.width = this.chartElem.nativeElement.getBoundingClientRect().width - 10;
    this.svg.attr('width', this.width);
    this.svg.attr('class', 'svg');
    this.xScale.range([this.margin, this.width - 2 * this.margin]);

    const xAxis = d3
      .axisBottom(this.xScale)
      .ticks(10)
      .tickFormat(d3.timeFormat('%d / %m / %Y'));

    this.xAxis.call(xAxis);

    const yAxis = d3
      .axisLeft(this.yScale);

    this.yAxis.call(yAxis);

    const line = d3
      .line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveMonotoneX);

    const pogPoints: [number, number][] = this.mappedStats.map(stats => {
      const pogStats = stats.pog;

      return [
        this.xScale(new Date(pogStats.date)),
        this.yScale(pogStats.value ? pogStats.value : 0),
      ];
    });

    const pogchampPoints: [number, number][] = this.mappedStats.map(stats => {
      const pogchampStats = stats.pogchamp;

      return [
        this.xScale(new Date(pogchampStats.date)),
        this.yScale(pogchampStats.value ? pogchampStats.value : 0),
      ];
    });

    const poguPoints: [number, number][] = this.mappedStats.map(stats => {
      const poguStats = stats.pogu;

      return [
        this.xScale(new Date(poguStats.date)),
        this.yScale(poguStats.value ? poguStats.value : 0),
      ];
    });

    const poggersPoints: [number, number][] = this.mappedStats.map(stats => {
      const poggersStats = stats.poggers;

      return [
        this.xScale(new Date(poggersStats.date)),
        this.yScale(poggersStats.value ? poggersStats.value : 0),
      ];
    });

    this.lineGroupPog.attr('d', line(pogPoints));
    this.lineGroupPogchamp.attr('d', line(pogchampPoints));
    this.lineGroupPogu.attr('d', line(poguPoints));
    this.lineGroupPoggers.attr('d', line(poggersPoints));
  }

  mapPogStagsToChartData(pogStats: GlobalPogStats): {
    pog: { value: number, date: string },
    pogchamp: { value: number, date: string },
    pogu: { value: number, date: string },
    poggers: { value: number, date: string }
  }[] {
    const keys = Object.keys(pogStats.timeseries).sort((a, b) => +new Date(a) - +new Date(b));

    return keys.map(key => {
      return {
        pog: {
          value: pogStats.timeseries[key]?.pog,
          date: new Date(key).toISOString()
        },
        pogchamp: {
          value: pogStats.timeseries[key]?.pogchamp,
          date: new Date(key).toISOString()
        },
        pogu: {
          value: pogStats.timeseries[key]?.pogu,
          date: new Date(key).toISOString()
        },
        poggers: {
          value: pogStats.timeseries[key]?.poggers,
          date: new Date(key).toISOString()
        }
      };
    });
  }
}
