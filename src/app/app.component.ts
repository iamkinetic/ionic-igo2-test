import {Component, OnInit} from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import {ContextLayer, ContextService, DataSourceService, DetailedContext, IgoMap, LayerService} from 'igo2';
@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  rootPage:any = HomePage;
  public map = new IgoMap();

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private dataSourceService: DataSourceService,
    private layerService: LayerService,
    public contextService: ContextService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
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

