import {Component, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import {ContextLayer, ContextService, DataSourceService, DetailedContext, IgoMap, LayerService} from 'igo2';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  public map = new IgoMap();

  constructor(public navCtrl: NavController,
              private dataSourceService: DataSourceService,
              private layerService: LayerService,
              public contextService: ContextService) {

  }

  ngOnInit() {

    const layer1 = {
      'source': {
        'title': 'Fond de carte du Québec',
        'type': 'xyz',
        'url': 'https://geoegl.msp.gouv.qc.ca/cgi-wms/mapcache.fcgi/tms/1.0.0/carte_gouv_qc_ro@EPSG_3857/{z}/{x}/{-y}.png'
      }
    };

    let lat: number = 46.20083;
    let long: number = -70.621622;

    console.log(long, lat);
    this.contextService.setContext({
      'uri': 'default',
      'title': 'Default Context',
      'map': {
        'view': {
          'projection': 'EPSG:3857',
          'center': [long, lat],
          'zoom': 14,
          'minZoom': 6,
          'maxZoom': 17
        }
      },
      'layers': [layer1]
    } as DetailedContext);

    this.addLayerToMap(layer1);
  }

  private addLayerToMap(contextLayer: ContextLayer) {
    const sourceContext = contextLayer.source;
    const layerContext = Object.assign({}, contextLayer);
    delete layerContext.source;

    const dataSourceContext = Object.assign({}, layerContext, sourceContext);

    this.dataSourceService
      .createAsyncDataSource(dataSourceContext)
      .subscribe(dataSource =>  {
        this.map.addLayer(
          this.layerService.createLayer(dataSource, layerContext));
      });
  }
}
