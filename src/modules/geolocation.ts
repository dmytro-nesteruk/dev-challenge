export class Geolocation {
  private id: number | null;
  private geoposition: GeolocationCoordinates | null;

  constructor() {
    this.id = null;
    this.geoposition = null;
    this.init();
  }

  private init = () => {
    if (!navigator.geolocation || !navigator.geolocation.watchPosition) {
      throw new Error('Geoposition API not supported in your browser.');
    }

    this.id = navigator.geolocation.watchPosition(
      (data) => {
        this.geoposition = data.coords;
        console.log(data);
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );
  };

  public getPosition = () => {
    return this.geoposition;
  };

  public clear = () => {
    if (this.id) {
      navigator.geolocation.clearWatch(this.id);
    }
  };
}
