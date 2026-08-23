import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import type { Config, DotLottie } from '@lottiefiles/dotlottie-web';

export type LoadingSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.loading-host--overlay]': 'overlay()',
  },
})
export class LoadingComponent implements AfterViewInit, OnDestroy {
  readonly animationPath = input<string>('animations/OC.json');
  readonly label = input<string>('Carregando...');
  readonly showLabel = input<boolean>(true);
  readonly overlay = input<boolean>(false);
  readonly size = input<LoadingSize>('md');
  readonly active = input<boolean>(true);
  readonly autoplay = input<boolean>(true);
  readonly loop = input<boolean>(true);
  readonly speed = input<number>(1);

  @ViewChild('canvas', { static: true })
  private readonly canvasRef!: ElementRef<HTMLCanvasElement>;

  protected readonly hostClasses = computed(() => ({
    loading: true,
    'loading--overlay': this.overlay(),
    [`loading--${this.size()}`]: true,
  }));

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private player?: DotLottie;
  private hasView = false;
  private isDestroyed = false;

  private readonly playerConfig = computed<Omit<Config, 'canvas'>>(() => ({
    src: this.animationPath(),
    autoplay: this.autoplay(),
    loop: this.loop(),
    speed: this.speed(),
    backgroundColor: 'transparent',
    layout: {
      fit: 'contain',
      align: [0.5, 0.5],
    },
    renderConfig: {
      autoResize: true,
    },
  }));

  constructor() {
    effect(() => {
      const config = this.playerConfig();

      if (!this.hasView || !this.player) {
        return;
      }

      this.player.load(config);
    });

    effect(() => {
      const shouldPlay = this.active() && this.autoplay();

      if (!this.hasView || !this.player) {
        return;
      }

      this.syncPlayback(shouldPlay);
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.hasView = true;
    void this.createPlayer();
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.player?.destroy();
  }

  private async createPlayer(): Promise<void> {
    const { DotLottie } = await import('@lottiefiles/dotlottie-web');

    if (this.isDestroyed) {
      return;
    }

    this.player = new DotLottie({
      canvas: this.canvasRef.nativeElement,
      ...this.playerConfig(),
      autoplay: this.autoplay() && this.active(),
    });
  }

  private syncPlayback(shouldPlay: boolean): void {
    if (shouldPlay) {
      this.player?.play();
      return;
    }

    this.player?.pause();
  }
}
