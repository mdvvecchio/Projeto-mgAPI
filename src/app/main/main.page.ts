import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  peripheral: any = {}; 
  statusMessage: string;
  ncorrente:number = 1000;
  Mxoutcorrente: number = 1000;
  ctetermicamotor:number = 313;
  sigla:string = "";
  teste:string = "";
  b:number = 0;
  k:number = 0;
 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private ngZone: NgZone,
    private bluetooth: BluetoothSerial
              ) {
    
    let data;

    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.peripheral = JSON.parse(params.special);
      }
    });

  }

  start_process() {
    
    let sendData:string = "s#"+this.ncorrente
    +"#"+this.Mxoutcorrente
    +"#"+this.ctetermicamotor
    +"#"+this.sigla
    +"#"+this.teste
    +"#"+this.k
    +"#"+this.b;

    this.bluetooth.write(sendData)
    .then( sucess => {
      this.showToast(sucess);
      this.readblue();
    }, error => {
      console.log("Erro no envio");
      this.showError(error);
    })
  }

  change_value() {
    let sendData:string = "cv#"+this.ncorrente
    +"#"+this.Mxoutcorrente
    +"#"+this.ctetermicamotor
    +"#"+this.k
    +"#"+this.b;

    this.bluetooth.write(sendData)
    .then( sucess => {
      this.showToast(sucess);
      this.readblue();
    }, error => {
      console.log("Erro no envio");
      this.showError(error);
    })
  }

  finalizar() {
    let sendData:string = "f#";

    this.bluetooth.write(sendData)
    .then( sucess => {
      this.showToast(sucess);
      this.readblue();
      this.bluetooth.disconnect()
      this.router.navigate(['home']);
    }, error => {
      console.log("Erro no envio");
      this.showError(error);
    })
  }

  readblue() {

    this.bluetooth.available().then(
      (number: any) => {
        this.bluetooth.read()
        .then((data: any) => {
          this.showToast("Dados Enviados");          
          this.bluetooth.clear();
        });
      }
    )
  }

  ngOnInit() {
    
  }

  async showError(error) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      subHeader: error,
      buttons: ['Dimiss']
    });
    alert.present();
  }

  async showToast(msj) {
    const toast = await this.toastCtrl.create({
      message: msj,
      duration: 1000
    });
    toast.present();
  }
}