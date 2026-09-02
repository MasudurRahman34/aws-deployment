<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TestEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $messageText
    ) {}

    public function build()
    {
        return $this
            ->subject('PrintLab Test Email')
            ->view('email.test');
    }
}