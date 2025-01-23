import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit{
  title = 'image-test';
  canvas: HTMLCanvasElement | undefined;
  context: CanvasRenderingContext2D | undefined | null;
  player: HTMLVideoElement | undefined | null;
  captured: boolean = false;
  constraints = {
    video: {
      facingMode: {
        exact: 'environment'
      }
    }
  };

  ngAfterViewInit() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.context = this.canvas?.getContext('2d');
    this.player = document.getElementById('player') as HTMLVideoElement;

    this.stream();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          if (this.context) {
            this.context.drawImage(img, 0, 0, this.canvas?.width as number, this.canvas?.height as number);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  capture() {
    if (this.context && this.player && this.canvas) {
      this.context.drawImage(this.player, 0, 0, this.canvas.width, this.canvas.height);
      this.captured = true;
    }

  }

  cancel() {
    this.captured = false;
    this.stream();
  }

  stream() {
    navigator.mediaDevices.getUserMedia(this.constraints)
    .then((stream) => {
      if (this.player) {
        this.player.srcObject = stream;
      }
    });
  }
}
