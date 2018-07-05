// libs
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Injector } from '@angular/core';
import { Config, RouterExtensions } from '../../../modules/core/index';

// services
import { RankingsService } from '../../../shared/modules/m-edificando-o-controle-interno/services/rankings.service';
import { BuscaService } from '../../../shared/modules/m-observatorio-suas/services/busca.service';
import { DadosEIndicadoresService } from '../../../shared/modules/m-observatorio-suas/services/dados-e-indicadores.service';
import { IRankings } from '../../../shared/modules/m-edificando-o-controle-interno/services/IRankings';
import { IPesquisa } from '../../../shared/modules/m-observatorio-suas/services/IPesquisa';
import { IEquipamento } from '../../../shared/modules/m-observatorio-suas/services/IEquipamento';

// module libs
import { GradacoesDeCores } from '../../../shared/modules/m-edificando-o-controle-interno/GradacoesDeCores';

@Component({
  moduleId: module.id,
  selector: 'mp-home',
  templateUrl: 'mp-home.component.html',
  styleUrls: ['mp-home.component.css']
})
export class MPHomeComponent {

  public top10Cidades: string[] = ['§vazio§', '§vazio§', '§vazio§', '§vazio§', '§vazio§', '§vazio§', '§vazio§', '§vazio§', '§vazio§', '§vazio§'];
  public top10Notas: number[] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

  public errorMessage: string = null;

  public equipamentos: IPesquisa[] = [];

  public porcentagemCreas: string;
  public porcentagemCras: string;
  public porcentagemCentroPop: string;
  
  totalCras : number = 0;
  totalCreas : number = 0;
  totalCentroPop : number = 0;
  
  // constroi a estrutura 'top10Cidades'
  constructor(private rankingsService: RankingsService, private buscaService: BuscaService,
    private dadosEIndicadoresService: DadosEIndicadoresService, private gradacoes: GradacoesDeCores) {

    rankingsService.fetchRankings().subscribe(response => {
      let rankings: IRankings[] = response.sort((e1, e2) => e2.geral - e1.geral);
      for (let i = 0; i < this.top10Cidades.length; i++) {
        this.top10Cidades[i] = rankings[i].municipio;
        this.top10Notas[i] = rankings[i].geral;
      }
    }, error => this.errorMessage = <any>error);

  
    this.dadosEIndicadoresService.fetchCRAS().subscribe(response => {
      this.totalCras = response.length;
    }, error => this.errorMessage = <any>error)

    this.dadosEIndicadoresService.fetchCREAS().subscribe(response => {   
      this.totalCreas = response.length;
    }, error => this.errorMessage = <any>error)
     
    this.dadosEIndicadoresService.fetchCentroPop().subscribe(response => {
      this.totalCentroPop = response.length;
    }, error => this.errorMessage = <any>error)
   
    buscaService.fetchPesquisa().subscribe(response => {
      let creas: number = 0;
      let cras: number = 0;
      let centroPop: number = 0;
      this.equipamentos = response;
       
      for (let i: number = 0; i < this.equipamentos.length; i++) {
        if (this.equipamentos[i].nome.toUpperCase().indexOf('creas'.toUpperCase()) !== -1) {
          creas++;
        }
        if (this.equipamentos[i].nome.toUpperCase().indexOf('cras'.toUpperCase()) !== -1) {
          cras++;
        }
        if (this.equipamentos[i].nome.toUpperCase().indexOf('centro pop'.toUpperCase()) !== -1) {
          centroPop++;
        }
      }
     

      this.porcentagemCras = ((cras * 100) / 442).toFixed(2).concat('%');
      this.porcentagemCreas = ((creas * 100) / 116).toFixed(2).concat('%');
      this.porcentagemCentroPop = ((centroPop * 100) / 19).toFixed(2).concat('%');
      console.log(this.porcentagemCras);
      console.log(this.porcentagemCreas)
      console.log(this.porcentagemCentroPop);
      console.log(this.totalCras);
      console.log(this.totalCreas);
      console.log(this.totalCentroPop);
    }, error => this.errorMessage = <any>error);
  }
}
