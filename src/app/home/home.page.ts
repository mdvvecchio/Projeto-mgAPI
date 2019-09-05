import { Component, NgZone } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  pairedList: pairedList;
  listToggle: boolean = false;
  pairedDeviceID: number =0;
  dataSend: string = "";

  constructor(
    private router: Router,
    public navCtrl: NavController, 
    private alertCtrl: AlertController,
    private bluetoothSerial: BluetoothSerial,
    private toastCtrl: ToastController,
    private ngZone: NgZone
  ) {
    this.checkBluetoothEnabled();
  }

  checkBluetoothEnabled() {
    this.bluetoothSerial.isEnabled()
    .then( sucess => {
      this.listPairedDevices();
    }, error => {
      this.bluetoothSerial.enable().then(
        sucess => {
          
        },
        failure => { 
          console.log(failure);
          this.showError(failure);
        }
      )
      
    });
  }

  listPairedDevices() {
    this.bluetoothSerial.discoverUnpaired().then(
      sucess => {
        this.pairedList = sucess;
      },
      error => {
        console.log(JSON.stringify(error))
      }
    )
  }

  connect(connectedDevice) {
    this.bluetoothSerial.connect(connectedDevice.address).subscribe(
      sucess => {
        this.deviceConnected();
        this.showToast("Sucessfully connected");

        let navigationExtras: NavigationExtras = {
	        queryParams: {
	          special: JSON.stringify(connectedDevice)
	        }
        };
        this.router.navigate(['main'], navigationExtras);
      },
      error => {
        this.showError("Error: Connecting to device");
      }
    );
  }

  deviceConnected() {
    this.bluetoothSerial.subscribe('\n').subscribe(
      sucess => {
        this.handleData(sucess);
        this.showToast("Connected Sucessfully");
      }, error => {
        this.showError(error);
      }
    );
  }

  deviceDisconnected() {
    this.bluetoothSerial.disconnect();
    this.showToast("Device Disconnected");
  }

  handleData(data) {
    this.showToast(data);
  }

  sendData() {
    this.dataSend+='\n';
    this.showToast(this.dataSend);

    this.bluetoothSerial.write(this.dataSend)
    .then ( sucess => {
      this.showToast(sucess);
    }, error => {
      this.showError(error);
    });
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
  ngOnInit() { 
  }
}

interface pairedList {
  "class": number,
  "id": string,
  "address": string,
  "name": string
}