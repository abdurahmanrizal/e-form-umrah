<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Form Akad Pembelian Paket Umroh</title>
    <style>
        @page { margin: 24px 42px 34px; }
        * { box-sizing: border-box; }
        body { color: #202020; font-family: DejaVu Serif, serif; font-size: 11px; line-height: 1.42; margin: 0; }
        .header-table, .data-table, .sign-table { width: 100%; border-collapse: collapse; }
        .letterhead { height: 128px; position: relative; margin: -24px -42px 14px; padding: 22px 42px 0; border-bottom: 2.2px solid #252525; }
        .header-ornament { position: absolute; z-index: -1; top: 0; left: 0; width: 100%; height: 112px; }
        .header-table { position: relative; z-index: 2; }
        .logo-cell { width: 29%; vertical-align: middle; }
        .logo { width: 150px; height: 88px; object-fit: contain; }
        .company { text-align: center; vertical-align: middle; padding: 2px 25px 0 0; }
        .company h1 { font-family: DejaVu Sans, sans-serif; font-size: 22px; line-height: 1.05; margin: 0 0 8px; letter-spacing: .25px; font-weight: 900; }
        .company p { font-family: DejaVu Sans, sans-serif; margin: 3px 0; font-size: 9.3px; font-weight: 600; }
        .company .email { color: #275c91; text-decoration: underline; }
        .company .wa { color: #276f42; font-family: DejaVu Sans, sans-serif; font-weight: bold; }
        .title { text-align: center; font-size: 14px; font-weight: bold; text-decoration: underline; margin: 12px 0 22px; }
        h2 { font-size: 13px; margin: 18px 0 9px; text-transform: uppercase; }
        .intro { margin: 0 0 14px; }
        .data-table td { padding: 2px 0; vertical-align: top; }
        .data-table td:first-child { width: 190px; }
        .data-table td:nth-child(2) { width: 14px; }
        .value { font-weight: bold; }
        .facility-list { margin: 8px 0 16px 18px; padding: 0; }
        .facility-list li { padding: 1px 0; }
        .terms-page { font-size: 10px; line-height: 1.34; }
        .terms { margin: 7px 0 0 15px; padding-left: 13px; }
        .terms li { padding: 2px 0; }
        .terms-details { list-style-type: circle; margin: 2px 0 0 18px; padding-left: 13px; }
        .terms-details li { padding: 0; }
        .payment { margin-top: 14px; }
        .closing { margin-top: 15px; }
        .sign-table { margin-top: 18px; page-break-inside: avoid; table-layout: fixed; text-align: center; }
        .sign-table td { width: 50%; padding: 0 18px; vertical-align: top; }
        .sign-title { font-weight: bold; }
        .signature-space { height: 82px; margin-top: 6px; text-align: center; }
        .signature-image { display: block; width: 190px; height: 78px; object-fit: contain; margin: 0 auto; }
        .sign-name { font-weight: bold; line-height: 1.35; text-align: center; }
        .sign-role { font-weight: normal; }
        .page-two-header { page-break-before: always; }
        .small { font-size: 9px; color: #555; }
    </style>
</head>
<body>
    @php
        $renderLetterhead = static function (string $additionalClass = '') use ($logoPath, $headerOrnamentPath, $settings): void {
    @endphp
        <div class="letterhead {{ $additionalClass }}">
            <img class="header-ornament" src="{{ $headerOrnamentPath }}" alt="">
            <table class="header-table">
                <tr>
                    <td class="logo-cell"><img class="logo" src="{{ $logoPath }}" alt="The Sultan"></td>
                    <td class="company">
                        <h1>{{ $settings['company_name'] }}</h1>
                        <p>{{ $settings['company_address'] }}</p>
                        <p>Email: <span class="email">{{ $settings['company_email'] }}</span></p>
                        <p>Telp/WhatsApp {{ $settings['company_phone'] }}</p>
                    </td>
                </tr>
            </table>
        </div>
    @php
        };
        $renderLetterhead();
    @endphp

    <div class="title">FORM AKAD PEMBELIAN PAKET UMROH</div>
    <p class="intro">Dengan hormat,<br>Yang bertanda tangan di bawah ini:</p>

    <h2>Data Jamaah</h2>
    <table class="data-table">
        <tr><td>Nama Lengkap</td><td>:</td><td class="value">{{ $jamaah->full_name }}</td></tr>
        <tr><td>Tempat / Tgl Lahir</td><td>:</td><td>{{ $jamaah->birth_place }}, {{ $jamaah->birth_date?->translatedFormat('d F Y') }}</td></tr>
        <tr><td>No. KTP / Passport</td><td>:</td><td>{{ $jamaah->nik ?: $jamaah->passport_number ?: '-' }}</td></tr>
        <tr><td>Alamat</td><td>:</td><td>{{ $jamaah->address }}</td></tr>
        <tr><td>No. HP</td><td>:</td><td>{{ $jamaah->phone }}</td></tr>
    </table>

    <h2>Data Paket Umroh</h2>
    <table class="data-table">
        <tr><td>Nama Paket</td><td>:</td><td class="value">{{ $package->name }}</td></tr>
        <tr><td>Tanggal Keberangkatan</td><td>:</td><td>{{ $package->departure_date?->translatedFormat('d F Y') }}</td></tr>
        <tr><td>Harga</td><td>:</td><td class="value">Rp {{ $package->price ? number_format((float) $package->price, 0, ',', '.') : '........................................................' }}</td></tr>
    </table>

    <h2>Akad & Kesepakatan</h2>
    <p><em>Bismillahirrahmanirrahim</em></p>
    <p>Dengan ini saya menyatakan telah melakukan pemesanan paket umroh dengan fasilitas:</p>
    <ul class="facility-list">
        @forelse ($package->facilities as $facility)
            <li>{{ $facility->name }}</li>
        @empty
            <li>Fasilitas sesuai ketentuan paket umroh</li>
        @endforelse
    </ul>
    <p class="small">Nomor registrasi: {{ $registration->registration_number }}</p>

    @php
        $renderLetterhead('page-two-header');
    @endphp
    <div class="terms-page">
    <p>Dan menyetujui ketentuan sebagai berikut:</p>
    <ol class="terms">
        <li>Jamaah bersedia melengkapi seluruh dokumen persyaratan umroh sesuai dengan ketentuan yang berlaku dari pihak travel maupun Pemerintah Arab Saudi.</li>
        <li>Jamaah wajib melakukan pembayaran <em>Down Payment</em> <strong>(DP)</strong> minimal sebesar <strong>Rp5.000.000</strong> sebagai tanda jadi pendaftaran paket umroh.</li>
        <li>Pelunasan biaya perjalanan umroh wajib diselesaikan paling lambat <strong>30 (tiga puluh) hari</strong> sebelum tanggal keberangkatan.</li>
        <li>
            Harga paket umroh dapat mengalami penyesuaian sewaktu-waktu apabila terjadi kondisi <strong>force majeure</strong> atau perubahan kebijakan, meliputi:
            <ul class="terms-details">
                <li>kenaikan harga avtur,</li>
                <li>perubahan kurs Dollar Amerika (USD),</li>
                <li>perubahan kurs Riyal Saudi (SAR),</li>
                <li>kenaikan biaya visa,</li>
                <li>maupun kebijakan Pemerintah Arab Saudi yang berdampak pada biaya operasional perjalanan umroh.</li>
            </ul>
        </li>
        <li>Pembatalan keberangkatan secara sepihak oleh jamaah mengakibatkan <em>Down Payment</em> <strong>(DP)</strong> yang telah dibayarkan dinyatakan hangus dan tidak dapat dikembalikan.</li>
        <li>Jamaah yang melakukan pembatalan keberangkatan dapat mengajukan perubahan jadwal keberangkatan <em>(reschedule)</em> ke periode berikutnya sesuai dengan ketentuan yang berlaku dari pihak travel dan maskapai maximal 3 bulan dari tanggal booking sebelumnya.</li>
        <li>Apabila terjadi pembatalan keberangkatan yang disebabkan oleh pihak travel maka untuk <em>Down Payment</em> dan pelunasan yang sudah dibayarkan akan dikembalikan secara utuh.</li>
        <li>Jika terjadi pembatalan keberangkatan dikarenakan adanya <strong>force majeure</strong> maka akan direschedule untuk jadwal keberangkatan.</li>
        <li>Jamaah wajib menjaga ketertiban, nama baik rombongan, serta mengikuti arahan dari <strong>Tour Leader</strong> dan <strong>Mutowif</strong> selama perjalanan ibadah berlangsung.</li>
    </ol>

    <h2 class="payment">Pembayaran</h2>
    <table class="data-table">
        <tr><td>Metode Pembayaran</td><td>:</td><td>........................................................</td></tr>
        <tr><td>DP</td><td>:</td><td>Rp ........................................................</td></tr>
        <tr><td>Tanggal Pembayaran</td><td>:</td><td>........................................................</td></tr>
        <tr><td>Kekurangan Pembayaran</td><td>:</td><td>Rp ........................................................</td></tr>
    </table>
    <p class="closing">Demikian formulir akad ini dibuat dalam keadaan sadar dan tanpa paksaan dari pihak manapun.</p>
        <table class="sign-table">
            <tr>
                <td>
                    <div class="sign-title">PIHAK JAMAAH</div>
                    <div class="signature-space">
                        @if ($signaturePath && file_exists($signaturePath))
                            <img class="signature-image" src="{{ $signaturePath }}" alt="Tanda tangan jamaah">
                        @endif
                    </div>
                    <div class="sign-name">{{ $jamaah->full_name }}<br><span class="sign-role">Jamaah</span></div>
                </td>
                <td>
                    <div class="sign-title">{{ $settings['company_name'] }}</div>
                    <div class="signature-space">
                        @if ($managerSignaturePath && file_exists($managerSignaturePath))
                            <img class="signature-image" src="{{ $managerSignaturePath }}" alt="Tanda tangan manajer">
                        @endif
                    </div>
                    <div class="sign-name">{{ $settings['manager_name'] }}<br><span class="sign-role">{{ $settings['manager_title'] }}</span></div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
