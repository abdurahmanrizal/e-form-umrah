# Product Requirements Document (PRD)
## Umrah Package & Jamaah Management System

**Document Version:** 1.0  
**Status:** Ready for Implementation  
**Primary Modules:** Dashboard, Umrah Packages, Jamaah Registration, Document Completeness  
**Target Platform:** Responsive Web Application  

---

## 1. Product Overview

Aplikasi ini digunakan untuk mengelola paket umrah, pendaftaran jamaah, kuota keberangkatan, kelengkapan dokumen, serta memberikan dashboard operasional kepada admin dan manajemen.

Sistem harus memungkinkan administrator untuk membuat paket umrah, mengaktifkan atau menonaktifkan paket, menentukan periode keberangkatan, kapasitas seat, serta fasilitas yang terdapat dalam paket.

Jamaah hanya dapat didaftarkan ke paket yang aktif dan masih tersedia seat. Setiap jamaah memiliki data identitas, paket yang dipilih, serta checklist kelengkapan dokumen seperti passport, KTP, pas foto, kartu keluarga, buku nikah, sertifikat vaksin, dan dokumen lain yang dapat dikonfigurasi.

---

# 2. Goals

## 2.1 Business Goals

1. Memusatkan pengelolaan data jamaah dalam satu aplikasi.
2. Mempermudah monitoring kuota seat setiap paket umrah.
3. Menghindari pendaftaran melebihi kapasitas keberangkatan.
4. Mempermudah monitoring kelengkapan dokumen jamaah.
5. Menampilkan kondisi operasional melalui dashboard.
6. Memungkinkan paket dibuka atau ditutup tanpa menghapus data historis.
7. Menyediakan dasar sistem yang dapat dikembangkan menjadi CRM dan operasional umrah yang lebih besar.

## 2.2 Product Goals

- CRUD paket umrah.
- Aktivasi/nonaktif paket.
- Manajemen fasilitas paket secara dinamis.
- Registrasi jamaah.
- Pemilihan paket aktif.
- Penghitungan seat otomatis.
- Checklist dokumen jamaah.
- Upload dokumen.
- Dashboard operasional.
- Search, filter, sorting, dan pagination.
- Role-based access control.
- Audit trail perubahan penting.

---

# 3. User Roles

## 3.1 Super Admin

Memiliki akses penuh terhadap seluruh sistem.

Hak akses utama:

- Mengelola user.
- Mengelola role dan permission.
- Mengelola paket.
- Mengelola master fasilitas.
- Mengelola master jenis dokumen.
- Mengelola jamaah.
- Melihat seluruh dashboard.
- Melihat audit log.

## 3.2 Admin Umrah

Hak akses:

- Membuat dan mengubah paket.
- Mengaktifkan/nonaktifkan paket.
- Mendaftarkan jamaah.
- Mengubah data jamaah.
- Upload dan verifikasi dokumen.
- Melihat dashboard operasional.

## 3.3 Manager

Hak akses utama:

- Melihat dashboard.
- Melihat detail paket.
- Melihat daftar jamaah.
- Melihat progress kelengkapan dokumen.
- Export laporan.

Secara default Manager tidak boleh menghapus data.

## 3.4 Document Officer

Hak akses:

- Melihat jamaah.
- Upload dokumen.
- Mengubah status dokumen.
- Memberikan catatan dokumen.

## 3.5 Read Only / Viewer

Hanya dapat melihat data sesuai permission.

---

# 4. Core Modules

# 4.1 Dashboard

Dashboard merupakan halaman utama setelah login.

## KPI Cards

Minimal menampilkan:

1. Total Jamaah
2. Total Paket Aktif
3. Total Paket Akan Berangkat
4. Total Seat
5. Seat Terisi
6. Seat Tersedia
7. Jamaah Dokumen Lengkap
8. Jamaah Dokumen Belum Lengkap

## Dashboard Charts

### A. Jamaah per Paket

Bar chart:

- X-axis: nama paket.
- Y-axis: jumlah jamaah.

### B. Seat Occupancy

Menampilkan persentase:

`seat_terisi / total_seat × 100%`

Status rekomendasi:

- 0–49%: Low
- 50–79%: Moderate
- 80–99%: Almost Full
- 100%: Full

### C. Document Completion

Donut/Pie chart:

- Complete
- Incomplete
- Need Review

### D. Registration Trend

Line chart jumlah jamaah yang didaftarkan berdasarkan tanggal.

Default:

- 30 hari terakhir.

Filter:

- 7 hari
- 30 hari
- 3 bulan
- 6 bulan
- 1 tahun
- custom range

## Upcoming Departures

Tabel keberangkatan terdekat:

| Paket | Keberangkatan | Kepulangan | Seat | Terisi | Tersedia | Kelengkapan |
|---|---|---|---:|---:|---:|---:|

Default sorting:

`departure_date ASC`

## Attention Required

Widget khusus menampilkan:

- Paket hampir penuh.
- Paket keberangkatan dekat tetapi jamaah belum lengkap.
- Jamaah dengan passport belum ada.
- Jamaah dengan passport akan expired.
- Dokumen perlu verifikasi.
- Paket aktif tanpa fasilitas.
- Paket aktif dengan seat 0.

---

# 4.2 Umrah Package Management

## Package List Page

Route recommendation:

`/packages`

Kolom:

- Package Code
- Package Name
- Departure Date
- Return Date
- Duration
- Total Seat
- Registered
- Available Seat
- Occupancy
- Status
- Registration Status
- Actions

Filter:

- Search package
- Status
- Departure month
- Departure date range
- Seat availability

Actions:

- Detail
- Edit
- Activate
- Deactivate
- Duplicate
- View Jamaah
- Archive

### Package Status

Business status:

- `draft`
- `active`
- `inactive`
- `full`
- `departed`
- `completed`
- `cancelled`
- `archived`

Catatan:

`full` sebaiknya merupakan status sistem berdasarkan kuota, bukan status manual.

---

## Package Form

Route:

`/packages/create`

dan:

`/packages/{id}/edit`

### Required Fields

#### Package Information

- Package Name
- Package Code
- Departure Date
- Return Date
- Total Seat

### Optional Fields

- Description
- Meeting Point
- Airline
- Hotel Makkah
- Hotel Madinah
- Room Type
- Price
- Registration Open Date
- Registration Close Date
- Notes

### Facility Section

Fasilitas tidak boleh disimpan sebagai satu string panjang.

Gunakan relasi package facilities.

Contoh fasilitas:

- Tiket pesawat PP
- Visa umrah
- Hotel Makkah
- Hotel Madinah
- Makan 3x sehari
- Transportasi
- Manasik
- Handling airport
- Tour leader
- Muthawwif
- Zamzam
- Perlengkapan umrah
- Asuransi
- City tour

Admin dapat:

- Memilih fasilitas dari master.
- Menambahkan fasilitas baru jika memiliki permission.
- Menghapus fasilitas dari paket.

---

## Package Activation

Paket dapat diaktifkan apabila minimal:

- Nama paket tersedia.
- Departure date tersedia.
- Return date tersedia.
- `return_date >= departure_date`
- Total seat > 0.
- Paket belum cancelled/archived.

Ketika paket `inactive`:

- Tidak muncul pada pilihan paket di form jamaah baru.
- Jamaah yang sudah terdaftar tidak terhapus.
- Laporan historis tetap tersedia.

---

## Seat Management

Setiap package memiliki:

`total_seats`

Seat digunakan berdasarkan registration yang aktif.

Formula:

`used_seats = SUM(jamaah.seat_count)`

Untuk fase pertama:

`jamaah.seat_count = 1`

Formula tersedia:

`available_seats = total_seats - used_seats`

Tidak boleh mengizinkan:

`used_seats > total_seats`

Validasi seat harus dilakukan di backend dalam database transaction untuk mencegah race condition.

---

# 4.3 Jamaah Registration

## Jamaah List

Route:

`/jamaah`

Kolom:

- Registration Number
- Jamaah Name
- NIK / Passport
- Package
- Departure Date
- Phone
- Document Completion
- Registration Status
- Created At
- Actions

Filter:

- Search
- Package
- Package status
- Departure month
- Registration status
- Document status
- Registration date

Actions:

- View
- Edit
- Documents
- Change Package
- Cancel Registration
- Print Summary
- Archive

---

## Jamaah Form

Route:

`/jamaah/create`

### Section A — Personal Data

Required:

- Full Name
- Gender
- Place of Birth
- Date of Birth
- Address
- Phone Number

Identity requirement:

Minimal salah satu:

- NIK
- Passport Number

Recommended fields:

- NIK
- Passport Number
- Passport Issue Date
- Passport Expiry Date
- Passport Issuing Office
- Email
- Province
- City/Regency
- District
- Village
- Postal Code

### Section B — Package Selection

Field:

- Umrah Package

Dropdown hanya menampilkan paket dengan kondisi:

- `status = active`
- `available_seats > 0`
- registration period masih valid jika tanggal pendaftaran digunakan.

Pada dropdown tampilkan:

`Nama Paket — Tanggal Keberangkatan — X seat tersisa`

Setelah memilih paket tampilkan summary:

- Departure date
- Return date
- Duration
- Available seat
- Facilities

### Section C — Emergency Contact

Fields:

- Emergency Contact Name
- Relationship
- Phone Number
- Address

### Section D — Medical / Special Notes

Optional:

- Blood Type
- Allergy
- Medical Notes
- Special Assistance
- Wheelchair Required
- Dietary Notes

Medical fields dapat diaktifkan sesuai kebutuhan implementasi dan kebijakan privasi organisasi.

### Section E — Notes

- Internal Notes
- Jamaah Notes

---

# 4.4 Jamaah Document Completeness

Dokumen harus menggunakan master jenis dokumen agar dapat dikembangkan secara dinamis.

## Default Document Types

1. Passport
2. KTP
3. Kartu Keluarga
4. Pas Foto
5. Buku Nikah
6. Akta Kelahiran
7. Sertifikat Vaksin
8. Visa
9. Tiket
10. Dokumen lain

Tidak semua dokumen wajib untuk semua jamaah.

Master document memiliki:

- Name
- Code
- Is Required Default
- Requires Expiry Date
- Allowed File Types
- Max File Size
- Active

---

## Jamaah Document Fields

Setiap dokumen memiliki:

- Jamaah
- Document Type
- Document Number
- File
- Issue Date
- Expiry Date
- Status
- Verification Date
- Verified By
- Note

Status:

- `missing`
- `uploaded`
- `under_review`
- `verified`
- `rejected`
- `expired`

---

## Document Completion Formula

Dokumen dinyatakan complete apabila seluruh dokumen `required` memiliki status:

`verified`

Formula:

`completion_percentage = verified_required_documents / total_required_documents × 100`

Jika tidak ada required document:

`completion_percentage = 100`

---

## Passport Alert

Sistem direkomendasikan memberikan warning apabila masa berlaku passport terlalu dekat dengan departure date.

Rule harus configurable.

Contoh default:

`passport_expiry_date >= departure_date + 6 months`

Jika tidak memenuhi:

- tampilkan warning.
- jamaah masuk ke Attention Required.
- jangan otomatis menghapus pendaftaran.

---

# 4.5 Jamaah Detail Page

Route:

`/jamaah/{id}`

Tabs:

1. Overview
2. Package
3. Documents
4. Activity
5. Notes

## Overview

Menampilkan:

- Personal information
- Registration number
- Selected package
- Departure details
- Contact information
- Emergency contact
- Document completion

## Documents

Card/table setiap dokumen:

- Status
- File
- Expiry
- Verification
- Notes

## Activity

Timeline:

- Registered
- Package changed
- Document uploaded
- Document verified
- Data edited
- Registration cancelled

---

# 5. Registration Status

Registration status:

- `draft`
- `registered`
- `confirmed`
- `cancelled`
- `departed`
- `completed`

Recommended transitions:

```text
draft
  ↓
registered
  ↓
confirmed
  ↓
departed
  ↓
completed

registered/confirmed
  ↓
cancelled
```

Cancelled jamaah tidak dihitung sebagai used seat.

---

# 6. Package Change Flow

Admin dapat memindahkan jamaah ke package lain.

Flow:

1. Open jamaah detail.
2. Klik Change Package.
3. Pilih package tujuan.
4. System mengecek package aktif.
5. System mengecek seat.
6. Admin mengisi reason.
7. Submit.
8. Database transaction:
   - lock package seat calculation;
   - update jamaah package;
   - record audit history.
9. Seat package lama otomatis bertambah tersedia.
10. Seat package baru otomatis berkurang.

---

# 7. Cancellation Flow

Ketika jamaah dibatalkan:

- Registration status menjadi `cancelled`.
- Seat dikembalikan ke package.
- Data jamaah tidak dihapus.
- Dokumen tetap tersimpan.
- Reason wajib diisi.
- Activity log dibuat.

---

# 8. Master Data

Minimal master:

## 8.1 Facilities

Fields:

- code
- name
- description
- active

## 8.2 Document Types

Fields:

- code
- name
- required_default
- requires_expiry
- allowed_extensions
- max_file_size
- active

## 8.3 Users

## 8.4 Roles

## 8.5 Permissions

Optional future masters:

- Airlines
- Hotels
- Cities
- Departure airports
- Tour leaders
- Muthawwif

---

# 9. Notifications

Phase 1:

In-app alert.

Recommended alerts:

- Departure H-30.
- Departure H-14.
- Departure H-7.
- Passport incomplete.
- Required documents incomplete.
- Passport validity issue.
- Seat almost full.
- Package full.

Phase berikutnya:

- WhatsApp notification.
- Email notification.

---

# 10. Search and Filters

Semua list besar harus menggunakan server-side:

- search
- pagination
- filters
- sorting

Default page size:

- 10
- 25
- 50
- 100

Search jamaah minimal meliputi:

- name
- registration_number
- NIK
- passport_number
- phone

---

# 11. Export & Reports

Minimum export:

## Package Manifest

Export jamaah per package:

- Registration Number
- Name
- Gender
- Date of Birth
- NIK
- Passport
- Passport Expiry
- Phone
- Document Status

Formats:

- Excel
- PDF

## Document Completion Report

- Jamaah
- Package
- Required documents
- Verified documents
- Missing documents
- Completion percentage

---

# 12. Dashboard Filters

Global dashboard filters:

- Departure date range
- Package
- Package status

Optional:

- Branch
- Sales channel
- Agent
- Registration source

---

# 13. Business Rules

## BR-001

Package inactive tidak dapat dipilih untuk jamaah baru.

## BR-002

Pendaftaran tidak boleh melebihi total seat.

## BR-003

Cancelled registration tidak menggunakan seat.

## BR-004

Package yang sudah memiliki jamaah tidak boleh hard delete.

## BR-005

Jamaah yang sudah terdaftar tidak boleh hard delete.

## BR-006

Perubahan package harus tercatat di activity log.

## BR-007

Document verification hanya boleh dilakukan user dengan permission.

## BR-008

Return date tidak boleh sebelum departure date.

## BR-009

Registration number harus unik.

## BR-010

NIK jika diisi harus divalidasi sesuai format yang diterapkan organisasi.

## BR-011

Passport dapat digunakan sebagai identitas apabila NIK tidak tersedia sesuai kebutuhan jamaah.

## BR-012

Package full tidak boleh menerima jamaah baru.

---

# 14. Recommended Registration Number

Format:

`JMH/{YEAR}/{MONTH}/{SEQUENCE}`

Contoh:

`JMH/2026/08/000123`

Sequence harus dibuat secara atomic agar tidak duplicate.

---

# 15. Data Model

## packages

```text
id
uuid
code
name
description
departure_date
return_date
registration_open_date
registration_close_date
total_seats
price
meeting_point
airline
hotel_makkah
hotel_madinah
status
is_active
notes
created_by
updated_by
created_at
updated_at
deleted_at
```

## facilities

```text
id
uuid
code
name
description
is_active
timestamps
```

## package_facility

```text
id
package_id
facility_id
note
timestamps
unique(package_id, facility_id)
```

## jamaah

```text
id
uuid
registration_number
full_name
gender
place_of_birth
date_of_birth
nik
passport_number
passport_issue_date
passport_expiry_date
passport_issuing_office
email
phone
address
province
city
district
village
postal_code
emergency_contact_name
emergency_contact_relationship
emergency_contact_phone
emergency_contact_address
blood_type
allergy
medical_notes
special_assistance
dietary_notes
internal_notes
created_by
updated_by
timestamps
deleted_at
```

## package_registrations

Recommended memisahkan jamaah dan pendaftaran agar histori package lebih mudah.

```text
id
uuid
registration_number
jamaah_id
package_id
seat_count
status
registered_at
confirmed_at
cancelled_at
cancelled_by
cancellation_reason
created_by
updated_by
timestamps
```

## document_types

```text
id
uuid
code
name
is_required_default
requires_expiry
allowed_extensions_json
max_file_size_kb
is_active
timestamps
```

## package_document_requirements

Untuk requirement dokumen per package.

```text
id
package_id
document_type_id
is_required
timestamps
unique(package_id, document_type_id)
```

## jamaah_documents

```text
id
uuid
jamaah_id
package_registration_id
document_type_id
document_number
file_path
issue_date
expiry_date
status
verified_at
verified_by
rejection_reason
note
uploaded_by
timestamps
```

## registration_package_histories

```text
id
package_registration_id
from_package_id
to_package_id
reason
changed_by
changed_at
```

## activity_logs

```text
id
user_id
subject_type
subject_id
action
description
old_values_json
new_values_json
ip_address
user_agent
created_at
```

---

# 16. Suggested Database Indexes

## packages

- index(status)
- index(departure_date)
- index(is_active)
- unique(code)

## jamaah

- index(full_name)
- index(nik)
- index(passport_number)
- index(phone)

## package_registrations

- index(package_id, status)
- index(jamaah_id)
- unique(registration_number)

## jamaah_documents

- index(jamaah_id)
- index(package_registration_id)
- index(document_type_id, status)

---

# 17. Recommended Technical Architecture

Recommended stack:

### Backend

- Laravel 12
- PHP 8.3+
- MySQL 8
- Redis

### Frontend

- React
- Inertia.js
- TypeScript
- Tailwind CSS
- Shadcn/UI or equivalent component library

### Supporting

- Laravel Queue
- Laravel Scheduler
- Redis queue
- Object storage for uploaded documents

Recommended object storage:

- S3-compatible storage
- private bucket
- signed temporary URL for document preview/download

Jamaah documents should not be publicly accessible.

---

# 18. Security Requirements

1. Authentication required.
2. Role & permission authorization.
3. Server-side validation.
4. CSRF protection.
5. File validation.
6. MIME type validation.
7. Maximum upload size.
8. Private file storage.
9. Signed download URL.
10. Audit log.
11. Sensitive identity fields should not appear unnecessarily in logs.
12. Rate limiting on sensitive endpoints.
13. Encrypt sensitive values where required by organizational policy.

Permission examples:

```text
dashboard.view

package.view
package.create
package.update
package.activate
package.deactivate
package.archive

jamaah.view
jamaah.create
jamaah.update
jamaah.change_package
jamaah.cancel

jamaah_document.view
jamaah_document.upload
jamaah_document.verify
jamaah_document.reject

master.facility.manage
master.document_type.manage

report.view
report.export

user.manage
role.manage
permission.manage
audit.view
```

---

# 19. API / Backend Actions

Even when using Inertia, business logic should be separated into service/action classes.

Recommended actions:

```text
CreatePackageAction
UpdatePackageAction
ActivatePackageAction
DeactivatePackageAction

RegisterJamaahAction
UpdateJamaahAction
ChangeJamaahPackageAction
CancelRegistrationAction

UploadJamaahDocumentAction
VerifyJamaahDocumentAction
RejectJamaahDocumentAction

CalculatePackageSeatAvailabilityAction
CalculateDocumentCompletionAction
```

---

# 20. Concurrency Requirement

Seat allocation is a critical transaction.

Example:

```text
BEGIN TRANSACTION

SELECT package
FOR UPDATE

calculate active registrations

IF available seat < requested seat
    reject registration

create registration

COMMIT
```

Do not depend only on frontend validation.

---

# 21. Recommended UI Structure

```text
Dashboard

Umrah
├── Packages
│   ├── Package List
│   ├── Create Package
│   └── Package Detail
│
├── Jamaah
│   ├── Jamaah List
│   ├── Register Jamaah
│   └── Jamaah Detail
│
├── Documents
│   └── Document Monitoring
│
├── Reports
│   ├── Package Manifest
│   └── Document Completeness
│
└── Master Data
    ├── Facilities
    └── Document Types

Administration
├── Users
├── Roles
├── Permissions
└── Audit Logs
```

---

# 22. Dashboard UI Recommendation

Desktop layout:

```text
---------------------------------------------------------
 Dashboard                     Filter Package / Period
---------------------------------------------------------

[ Total Jamaah ] [ Active Packages ] [ Seats Available ]
[ Complete Docs ] [ Incomplete Docs ] [ Upcoming Trips ]

---------------------------------------------------------
 Registration Trend             Seat Occupancy
 [ Line Chart ]                  [ Bar / Donut ]
---------------------------------------------------------

 Upcoming Departures
 -------------------------------------------------------
 Package | Date | Seat | Used | Available | Docs
 -------------------------------------------------------

 Attention Required
 -------------------------------------------------------
 12 jamaah missing passport
 7 jamaah incomplete documents
 1 package almost full
 -------------------------------------------------------
```

Mobile:

- KPI cards 1 column / 2 columns.
- Charts vertically stacked.
- Table supports responsive card mode or horizontal scroll.

---

# 23. UX Requirements

1. Confirmation dialog for destructive state changes.
2. Autosave tidak wajib pada MVP.
3. Form validation message di bawah field.
4. Search menggunakan debounce.
5. Loading state pada tombol submit.
6. Prevent duplicate submission.
7. Empty state yang informatif.
8. Badge warna untuk package/document statuses.
9. Document completion progress bar.
10. Seat occupancy progress bar.
11. Filter dapat di-reset.
12. Query filter disimpan di URL agar dapat dibookmark.

---

# 24. MVP Scope

## Included

- Authentication
- Dashboard
- Package CRUD
- Package activation
- Facilities master
- Jamaah CRUD
- Package registration
- Seat validation
- Jamaah documents
- Document types
- Verification status
- Reports basic
- Role permission
- Audit activity

## Not Required for MVP

- Payment gateway
- Accounting
- Agent commission
- Flight API
- Hotel API
- Visa API
- WhatsApp automation
- Mobile app
- Advanced CRM
- Biometrics

---

# 25. Future Phase

## Phase 2

- Payment & installment tracking
- Invoice
- Payment reminder
- WhatsApp integration
- Agent/mitra management
- Leads / CRM
- Sales source
- Branch management
- Rooming list
- Flight manifest

## Phase 3

- Visa workflow
- Passport processing workflow
- Inventory perlengkapan jamaah
- Bus grouping
- Hotel room allocation
- Tour leader management
- Mobile jamaah portal
- Digital document signing

---

# 26. Acceptance Criteria

## Package

- [ ] Admin dapat membuat package.
- [ ] Admin dapat menentukan tanggal keberangkatan dan kepulangan.
- [ ] Admin dapat menentukan total seat.
- [ ] Admin dapat memilih multiple facilities.
- [ ] Admin dapat mengaktifkan package.
- [ ] Admin dapat menonaktifkan package.
- [ ] Package inactive tidak muncul pada jamaah registration.
- [ ] Package full tidak dapat dipilih untuk registration baru.
- [ ] Available seat dihitung otomatis.

## Jamaah

- [ ] Admin dapat mendaftarkan jamaah.
- [ ] Jamaah dapat memilih package aktif.
- [ ] Seat otomatis berkurang setelah registration berhasil.
- [ ] Registration tidak dapat melebihi seat.
- [ ] Admin dapat mengubah data jamaah.
- [ ] Admin dapat membatalkan registration.
- [ ] Cancelled registration mengembalikan seat.
- [ ] Admin dapat memindahkan package.
- [ ] Perubahan package tersimpan di activity history.

## Documents

- [ ] Master document type dapat dikelola.
- [ ] Admin dapat upload document.
- [ ] Document dapat diverifikasi.
- [ ] Document dapat direject.
- [ ] Completion percentage dihitung otomatis.
- [ ] Dashboard menampilkan jamaah incomplete.
- [ ] Passport expiry warning muncul sesuai configuration.

## Dashboard

- [ ] Total jamaah tampil.
- [ ] Active package tampil.
- [ ] Total seat tampil.
- [ ] Available seat tampil.
- [ ] Chart jamaah per package tampil.
- [ ] Upcoming departure tampil.
- [ ] Document completion tampil.
- [ ] Dashboard dapat difilter.

---

# 27. Definition of Done

Feature dianggap selesai apabila:

1. Business rule sudah diimplementasikan di backend.
2. Validation frontend dan backend tersedia.
3. Authorization tersedia.
4. Responsive desktop/tablet/mobile.
5. Unit/feature tests tersedia untuk critical flow.
6. Seat concurrency test tersedia.
7. Empty/loading/error states tersedia.
8. Activity/audit log tersedia untuk perubahan penting.
9. Tidak ada hardcoded facility/document type.
10. Code mengikuti AGENT.md.
11. Dokumentasi diperbarui.
