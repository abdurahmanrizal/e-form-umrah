---
name: umrah-jamaah-management
description: Domain skill for designing and implementing Umrah package, seat allocation, jamaah registration, document completeness, operational dashboard, and related workflows.
version: 1.0.0
---

# SKILL.md
## Umrah Package & Jamaah Management

Use this skill when a task involves:

- paket umrah
- keberangkatan umrah
- kuota atau seat
- registrasi jamaah
- identitas jamaah
- passport
- kelengkapan dokumen
- manifest
- document verification
- dashboard jamaah
- perubahan paket
- pembatalan jamaah
- operasional keberangkatan

---

# 1. Domain Purpose

Skill ini membantu agent memahami domain aplikasi pengelolaan jamaah umrah.

Primary domain relationship:

```text
Package
  ↓
Package Registration
  ↓
Jamaah
  ↓
Document Requirements
  ↓
Jamaah Documents
```

Package menentukan keberangkatan dan kapasitas.

Jamaah merupakan orang.

Package Registration merupakan relasi keikutsertaan jamaah pada package tertentu.

Pisahkan Jamaah dan Package Registration agar satu jamaah secara arsitektural dapat memiliki histori perjalanan/paket.

---

# 2. Key Domain Concepts

## Package

Satu program keberangkatan umrah.

Contoh:

```text
Umrah September 9 Hari
Umrah Maulid 12 Hari
Umrah Ramadhan 15 Hari
```

Package bukan hanya nama produk.

Package juga merupakan inventory kapasitas seat.

---

# 3. Package Lifecycle

Recommended lifecycle:

```text
draft
  ↓
active
  ↓
inactive

active
  ↓
full

active/full
  ↓
departed
  ↓
completed
```

Alternate terminal states:

```text
cancelled
archived
```

Rules:

- Draft belum dapat dipilih.
- Active dapat menerima registration.
- Inactive tidak menerima registration baru.
- Full tidak menerima registration baru.
- Departed tidak menerima registration.
- Completed bersifat historical.
- Cancelled tidak menerima registration.
- Archived hanya historical.

---

# 4. Active vs Status

Avoid confused duplicated state.

If both fields exist:

```text
status
is_active
```

define them clearly.

Preferred:

Use `status` as source of truth.

If `is_active` is retained for compatibility:

```text
is_active = status == active
```

Avoid contradictory conditions such as:

```text
status = inactive
is_active = true
```

---

# 5. Seat Domain

Seat is finite inventory.

Package contains:

```text
total_seats
```

Registration contains:

```text
seat_count
```

MVP default:

```text
seat_count = 1
```

Used seat:

```text
SUM(seat_count)
for seat-consuming registrations
```

Seat-consuming statuses normally:

```text
registered
confirmed
departed
completed
```

Non-seat-consuming:

```text
cancelled
```

Draft handling should follow business policy. Default recommendation: draft does not reserve seat unless reservation expiry is explicitly implemented.

---

# 6. Seat Race Condition

Example:

```text
Package available seat = 1
```

Two admins submit at exactly the same time.

Without locking:

```text
Admin A sees 1
Admin B sees 1

A registers
B registers

Result = overbooked
```

Correct pattern:

```text
transaction
↓
lock package
↓
recalculate used seat
↓
validate capacity
↓
write registration
↓
commit
```

Frontend available seat is informative only.

Backend is authoritative.

---

# 7. Seat Availability

Formula:

```text
available = max(total_seats - used_seats, 0)
```

Occupancy:

```text
occupancy_percentage =
used_seats / total_seats × 100
```

If total seat = 0:

```text
occupancy = 0
```

but package should not be activated.

---

# 8. Package Facility

Facilities are dynamic many-to-many data.

Model:

```text
Package
  many-to-many
Facility
```

Examples:

```text
Flight ticket
Visa
Hotel Makkah
Hotel Madinah
Meals
Bus
Tour leader
Muthawwif
Manasik
Airport handling
Insurance
Umrah kit
Zamzam
City tour
```

Do not make boolean columns for every facility unless there is an exceptional reason.

Bad:

```text
has_hotel
has_meal
has_visa
has_bus
has_zamzam
```

Preferred:

```text
facilities
package_facility
```

---

# 9. Jamaah

Jamaah = person entity.

Identity data can include:

```text
full_name
gender
birth_place
birth_date
nik
passport
address
phone
email
```

Do not model a jamaah as a package row.

Package participation belongs in registration.

---

# 10. Registration

PackageRegistration connects:

```text
Jamaah
  ↔
Package
```

It stores operational participation:

```text
registration_number
package_id
jamaah_id
status
seat_count
registered_at
confirmed_at
cancelled_at
cancellation_reason
```

---

# 11. Why Separate Jamaah and Registration

A jamaah may:

- travel more than once
- cancel one package
- join another package later
- have historical package movement

If package_id is stored directly as the only relation in jamaah:

- history becomes difficult
- future repeat customer flow becomes difficult
- cancellation/re-registration becomes ambiguous

Therefore prefer:

```text
jamaah
package_registrations
```

---

# 12. Package Change

Package movement is operationally significant.

Never just overwrite:

```text
package_id
```

without history.

Record:

```text
from_package
to_package
reason
changed_by
changed_at
```

Capacity check is mandatory on destination.

Use one transaction.

---

# 13. Cancellation

Cancellation is a status transition, not deletion.

Required fields:

```text
cancelled_at
cancelled_by
cancellation_reason
```

The registration remains visible in historical reporting.

Seat becomes available again.

---

# 14. Document Domain

Use a master table:

```text
document_types
```

Examples:

```text
Passport
KTP
KK
Photo
Marriage Book
Birth Certificate
Vaccination
Visa
Ticket
Other
```

Each type may define:

```text
is_required_default
requires_expiry
allowed_extensions
max_file_size
active
```

---

# 15. Package-specific Documents

Not all packages need identical document requirements.

Recommended:

```text
package_document_requirements
```

Example:

```text
Package A:
Passport = required
KTP = required
Photo = required
Marriage Book = optional

Package B:
Passport = required
KTP = required
Photo = required
Vaccination = required
```

This makes the workflow dynamic.

---

# 16. Jamaah Document

One record represents one document submission.

Fields:

```text
document_type
document_number
file
issue_date
expiry_date
status
verified_by
verified_at
rejection_reason
note
```

Status lifecycle:

```text
missing
  ↓
uploaded
  ↓
under_review
  ↓
verified
```

Alternate:

```text
under_review
  ↓
rejected
  ↓
uploaded
```

Expired may be derived or persisted according to implementation.

---

# 17. Document Completion

Completion should focus on required documents.

Example:

```text
Required documents = 5
Verified = 4

Completion = 80%
```

Uploaded is not necessarily complete.

Preferred complete condition:

```text
required document status == verified
```

unless product policy explicitly treats upload as sufficient.

---

# 18. Passport Validity

Passport expiry check should compare against departure date.

Concept:

```text
minimum_validity_date =
departure_date + configured validity buffer
```

Passport should satisfy:

```text
passport_expiry_date >= minimum_validity_date
```

Keep buffer configurable.

Do not treat a warning as automatic cancellation unless explicitly required.

---

# 19. Dashboard Domain

Dashboard answers operational questions:

```text
How many jamaah?
How many active departures?
Which package is nearly full?
How many seats remain?
Which departure is closest?
Who has incomplete documents?
Whose passport requires attention?
```

Primary metrics:

```text
total jamaah
active packages
upcoming departures
total seats
used seats
available seats
complete documents
incomplete documents
```

---

# 20. Upcoming Departure

Default:

```text
departure_date >= today
```

Sort:

```text
departure_date ASC
```

Recommended attention windows:

```text
H-30
H-14
H-7
```

These windows should become configurable when operational requirements grow.

---

# 21. Attention Queue

Attention queue should be action-oriented.

Examples:

```text
Passport missing
Passport validity issue
Required document missing
Document rejected
Package almost full
Package full
Departure within 7 days
```

An operational dashboard should highlight problems, not only totals.

---

# 22. Package Occupancy Categories

Recommended UI categories:

```text
0–49%    Low
50–79%   Moderate
80–99%   Almost Full
100%     Full
```

These categories are presentation rules, not core accounting logic.

---

# 23. Dynamic Configuration

Prefer master/configuration tables for:

```text
facilities
document types
document requirements
passport minimum validity
notification thresholds
```

Avoid hardcoding operational options into source code when admin configuration is expected.

---

# 24. Auditability

Important mutations must leave history.

Audit:

```text
package activation
package deactivation
seat-affecting registration
package change
cancellation
document upload
document verification
document rejection
```

This is important for operational accountability.

---

# 25. Privacy

Jamaah information includes identity documents.

Treat as confidential.

Rules:

```text
private storage
permission checks
minimal logs
no public file URLs
no document contents in audit logs
```

Mask identity numbers in screens where full value is unnecessary.

Example:

```text
NIK: ************1234
Passport: *****6789
```

Full values only on authorized detail views when required.

---

# 26. Search Behavior

Jamaah search should support operational identifiers:

```text
name
registration number
NIK
passport
phone
```

Package search:

```text
package code
package name
departure
```

---

# 27. Reporting Domain

## Manifest

A package manifest represents jamaah participating in a departure.

Typical columns:

```text
registration number
name
gender
date of birth
passport
passport expiry
phone
document status
```

## Document Readiness

Typical:

```text
jamaah
package
required count
verified count
missing count
completion
```

---

# 28. Recommended Future Extensions

The data model should not block future modules:

```text
payment
installment
invoice

agent/mitra
sales source
lead CRM

rooming list
hotel allocation
bus group

airline manifest
visa workflow

umrah kit inventory
departure checklist
```

Do not prematurely build all future modules unless requested.

---

# 29. Domain Decision Guide

When asked:

### "Can package be disabled?"

Answer:

Yes. Disable registration without deleting historical jamaah.

### "How to calculate seat?"

Answer:

Derived from capacity minus active seat-consuming registrations.

### "Where do documents go?"

Answer:

Master document type + jamaah document records.

### "Should passport be a column?"

Passport metadata may be on jamaah where useful, but uploaded passport file belongs to document records.

### "Can jamaah change package?"

Yes, using a transaction and package-change history.

### "Can a package be deleted?"

If unused draft: potentially.

If it has registrations: archive/deactivate instead.

---

# 30. Implementation Checklist

When implementing a domain task:

- [ ] Identify affected package.
- [ ] Determine whether capacity changes.
- [ ] Determine whether transaction/lock is required.
- [ ] Check authorization.
- [ ] Validate business state.
- [ ] Write activity history.
- [ ] Protect confidential data.
- [ ] Add tests.
- [ ] Avoid hardcoded master values.
- [ ] Update dashboard aggregates where applicable.

---

# 31. Examples

## Register Jamaah

```text
Admin opens registration
↓
Enter personal data
↓
Select active package
↓
System displays seat availability
↓
Enter documents if available
↓
Submit
↓
Backend locks package
↓
Backend verifies capacity
↓
Create/find jamaah
↓
Create package registration
↓
Create initial document requirement states
↓
Write activity
↓
Commit
↓
Show registration success
```

## Complete Document

```text
Open jamaah
↓
Documents
↓
Upload Passport
↓
Status = uploaded
↓
Document Officer reviews
↓
Verified
↓
Recalculate completion
↓
Dashboard readiness updated
```

## Cancel

```text
Open registration
↓
Cancel
↓
Reason required
↓
Transaction
↓
Status = cancelled
↓
Audit history
↓
Seat automatically available
```

---

# 32. Agent Response Pattern

For implementation tasks in this domain, the agent should:

1. State the business rule being implemented.
2. Identify transaction-sensitive operations.
3. Implement backend integrity before UI convenience.
4. Provide or update tests.
5. Mention migration/config changes.
6. Avoid unrelated refactors.

For bug fixes:

1. Reproduce/identify root cause.
2. Determine whether it can affect data integrity.
3. Fix at source of truth.
4. Add regression test.
5. Verify dashboard/seat/document derived state when relevant.

---

# 33. Definition of Correctness

A feature is domain-correct when:

```text
No package can be overbooked.

Inactive/full/departed packages cannot receive new registration.

Cancellation releases seat without deleting history.

Package changes preserve history and respect destination capacity.

Document completion is based on configured required documents.

Private jamaah files stay private.

Dashboard totals reflect backend source-of-truth data.
```
