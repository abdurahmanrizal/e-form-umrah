# AGENT.MD

## AI Coding Agent Instructions — Umrah Package & Jamaah Management System

This file defines mandatory implementation rules for any AI coding agent working on this repository.

---

# 1. Primary Objective

Build and maintain a production-ready Umrah Package & Jamaah Management System based on `PRD.md`.

The application must prioritize:

1. Data integrity.
2. Security.
3. Clear business rules.
4. Maintainable architecture.
5. Responsive professional UI.
6. Dynamic master data.
7. Avoiding hardcoded business workflows where configuration is more appropriate.

---

# 2. Source of Truth

Before implementing a feature, read:

1. `PRD.md`
2. `AGENT.MD`
3. `AGENTS.md`
4. `SKILL.md`
5. Existing repository conventions
6. Relevant migrations/models/services/tests

Conflict priority:

```text
Explicit user instruction
    >
PRD.md
    >
AGENT.MD
    >
SKILL.md
    >
existing convention
```

Do not silently change business rules.

---

# 3. Default Technology

Unless the existing repository specifies otherwise:

## Backend

- Laravel 12
- PHP 8.3+
- MySQL 8
- Redis

## Frontend

- React
- Inertia.js
- TypeScript
- Tailwind CSS

## Infrastructure

- Laravel Queue
- Laravel Scheduler
- Redis Queue
- Private object storage for documents

Do not replace the selected framework without explicit instruction.

---

# 4. Implementation Philosophy

Always prefer:

```text
simple
explicit
tested
transaction-safe
permission-aware
reusable
```

Avoid:

```text
massive controllers
business logic inside React components
duplicated validation
magic strings everywhere
N+1 queries
public jamaah documents
frontend-only seat validation
hard deletes for operational records
```

---

# 5. Backend Architecture

Recommended Laravel structure:

```text
app/
├── Actions/
│   ├── Package/
│   ├── Jamaah/
│   └── Document/
│
├── DTOs/
├── Enums/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   └── Resources/
│
├── Models/
├── Policies/
├── Queries/
├── Services/
└── Support/
```

Controllers should coordinate requests, not contain complex business logic.

Maximum desired controller responsibilities:

1. authorize
2. validate via FormRequest
3. call Action/Service
4. return response

---

# 6. Required Domain Models

Use equivalent naming if repository conventions require it.

Core entities:

```text
User
Role
Permission

Package
Facility
PackageFacility

Jamaah
PackageRegistration
RegistrationPackageHistory

DocumentType
PackageDocumentRequirement
JamaahDocument

ActivityLog
```

Never store package facilities as comma-separated text.

Never store document completeness as one unstructured text field.

---

# 7. Use Enums

Use PHP enums where practical.

Examples:

```text
PackageStatus
RegistrationStatus
DocumentStatus
Gender
```

Example package status:

```text
draft
active
inactive
full
departed
completed
cancelled
archived
```

Registration:

```text
draft
registered
confirmed
cancelled
departed
completed
```

Document:

```text
missing
uploaded
under_review
verified
rejected
expired
```

Do not repeat raw status strings across controllers/services/components.

---

# 8. Package Activation Rules

An agent MUST enforce package activation on the server.

A package cannot be activated when:

- package name empty
- departure date missing
- return date missing
- return date before departure date
- total seat <= 0
- package cancelled
- package archived

Do not rely only on disabled UI buttons.

---

# 9. Seat Allocation — CRITICAL RULE

Seat handling is a critical consistency boundary.

Every create registration, package change, restore, or cancellation that affects seat capacity must use a database transaction.

For allocation:

```text
DB transaction
    ↓
Lock destination package row FOR UPDATE
    ↓
Calculate seat usage from active registrations
    ↓
Compare with capacity
    ↓
Reject if unavailable
    ↓
Create/update registration
    ↓
Commit
```

Use:

```php
lockForUpdate()
```

or equivalent transaction-safe locking.

Never calculate available seat only from a stale frontend value.

Never trust a hidden form input containing available seat.

---

# 10. Seat Calculation

Default:

```text
used_seats =
SUM(package_registrations.seat_count)
WHERE status NOT IN (cancelled)
```

Recommended helper/action:

```text
CalculatePackageSeatAvailabilityAction
```

Do not introduce a mutable `available_seats` column unless there is a strong architectural reason and synchronization strategy.

Prefer deriving availability from:

```text
total_seats - used_seats
```

---

# 11. Jamaah Identity Rules

Jamaah registration must require sufficient identity.

At least one identification mechanism must be supplied according to configured business policy:

- NIK
- Passport number

Avoid hardcoding nationality assumptions into domain models.

NIK/passport uniqueness rules must follow product policy and account for historical records.

Never expose full identity values unnecessarily in logs.

---

# 12. Registration Number

Registration number must be unique.

Recommended format:

```text
JMH/YYYY/MM/000001
```

Generation must be transaction-safe.

Do not use:

```text
latest_id + 1
```

without locking/sequence protection.

Use a dedicated sequence mechanism when possible.

---

# 13. Package Change

Changing a jamaah's package must:

1. authorize action
2. validate destination package
3. verify active status
4. lock capacity
5. check available seat
6. require reason
7. update registration
8. create history record
9. write activity log

All critical writes must happen inside the same transaction.

---

# 14. Cancellation

Never delete a registration to represent cancellation.

Use:

```text
status = cancelled
cancelled_at
cancelled_by
cancellation_reason
```

Cancellation releases seat automatically via seat calculation.

Require a reason.

---

# 15. Document System

Document types MUST be dynamic.

Do not hardcode:

```text
passport
ktp
kk
photo
```

as individual database columns such as:

```text
passport_file
ktp_file
kk_file
photo_file
```

Instead use:

```text
document_types
jamaah_documents
```

Package-specific requirements use:

```text
package_document_requirements
```

---

# 16. Document Storage Security

Jamaah documents are private.

Rules:

- Store outside public web root OR private object storage.
- Never expose raw permanent public storage URL.
- Use authorization before download.
- Prefer signed temporary URLs.
- Validate MIME.
- Validate extension.
- Validate file size.
- Generate server-side storage names.
- Do not trust original filename.

Recommended storage key:

```text
jamaah/{jamaah_uuid}/{document_uuid}.{extension}
```

---

# 17. Passport Expiry

Passport validity check should be implemented as reusable domain logic.

Example service:

```text
PassportValidityService
```

The minimum validity period must be configurable.

Do not scatter a hardcoded `6 months` check across files.

---

# 18. Permissions

Every write endpoint needs authorization.

Example permission codes:

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

Backend policy/gate is mandatory.

UI hiding is supplementary, not security.

---

# 19. Validation

Use Laravel FormRequest.

Do not place large validation arrays directly in controllers.

Create separate request classes:

```text
StorePackageRequest
UpdatePackageRequest
StoreJamaahRequest
UpdateJamaahRequest
ChangePackageRequest
CancelRegistrationRequest
UploadJamaahDocumentRequest
VerifyJamaahDocumentRequest
RejectJamaahDocumentRequest
```

Date validation:

```text
return_date >= departure_date
```

Registration dates:

```text
registration_close_date >= registration_open_date
```

---

# 20. Query Performance

Avoid N+1.

Use:

```php
with()
withCount()
selectSub()
exists()
```

as appropriate.

Paginate large data sets server-side.

Dashboard queries must be optimized and should not load all registrations into PHP memory.

Use database aggregates.

---

# 21. Database Indexing

Review indexes when adding filters.

Likely indexes:

```text
packages.status
packages.departure_date
packages.is_active

jamaah.nik
jamaah.passport_number
jamaah.phone

package_registrations.package_id,status
package_registrations.jamaah_id

jamaah_documents.jamaah_id
jamaah_documents.package_registration_id
jamaah_documents.document_type_id,status
```

Avoid adding indexes blindly; verify query patterns.

---

# 22. Frontend Structure

Suggested:

```text
resources/js/
├── components/
│   ├── common/
│   ├── dashboard/
│   ├── package/
│   └── jamaah/
│
├── layouts/
├── pages/
│   ├── Dashboard/
│   ├── Packages/
│   ├── Jamaah/
│   ├── Documents/
│   ├── Reports/
│   └── Master/
│
├── types/
├── hooks/
└── lib/
```

Reusable components should be created for:

```text
StatusBadge
DataTable
Pagination
FilterPanel
EmptyState
ConfirmDialog
SeatProgress
DocumentProgress
FileUploader
DatePicker
```

---

# 23. UI / UX Rules

Target feel:

- professional
- modern
- clean
- low visual noise
- operationally efficient

Desktop:

- sidebar
- top navigation
- breadcrumb
- page title
- actions aligned right

Forms:

- grouped by section
- clear labels
- required indicator
- inline errors
- submit loading state
- disable duplicate submissions

Avoid giant single-column forms when grouping improves clarity.

---

# 24. Responsive Rules

Minimum support:

- 360px mobile
- tablet
- desktop
- large desktop

Tables may use:

- horizontal scroll
- responsive card representation

Do not hide critical actions on mobile.

---

# 25. Dashboard Rules

Dashboard must use aggregate data from backend.

Do not:

- fetch 10,000 jamaah and calculate totals in React
- calculate business-critical dashboard counts only in browser

Dashboard filters should map to URL query parameters.

Example:

```text
/dashboard?package_id=...&from=...&to=...
```

---

# 26. Activity Logs

Record important actions:

```text
package_created
package_updated
package_activated
package_deactivated

jamaah_registered
jamaah_updated
jamaah_package_changed
jamaah_registration_cancelled

document_uploaded
document_verified
document_rejected
```

Activity log should contain:

- actor
- subject
- action
- timestamp
- relevant old/new values

Redact sensitive fields.

Never log file contents.

---

# 27. Delete Strategy

Use soft delete where appropriate.

Do not hard delete:

- package with registrations
- jamaah with registrations
- verified document history

Prefer archive/status changes.

Master data may be deactivated instead of deleted when referenced.

---

# 28. Testing Rules

Every critical flow must include feature tests.

Required tests:

## Package

- create package
- invalid date
- activate package
- deactivate package

## Registration

- register jamaah
- active package only
- full package rejected
- cancelled registration releases seat
- package change
- package change to full destination rejected

## Concurrency

Create a test strategy for simultaneous seat allocation.

## Documents

- upload permitted file
- invalid file rejected
- document verify authorization
- document completion calculation

## Permissions

At least:

- unauthorized
- forbidden
- permitted

---

# 29. Test Naming

Use descriptive names.

Example:

```text
it_rejects_registration_when_package_has_no_available_seat
```

Avoid:

```text
test1
testRegistration
```

---

# 30. Error Handling

Use clear business messages.

Examples:

```text
Paket sudah penuh.
Paket sedang tidak aktif.
Tanggal kepulangan tidak boleh sebelum tanggal keberangkatan.
Jamaah tidak memiliki permission untuk tindakan ini.
Dokumen melebihi ukuran maksimum.
```

Do not expose:

- SQL queries
- stack traces
- internal storage paths
- exception internals

in production UI.

---

# 31. Date & Time

Use consistent timezone configuration.

Store datetimes consistently.

For date-only fields such as:

- date of birth
- departure date
- return date
- passport expiry date

use proper DATE columns where time is unnecessary.

Do not introduce timezone shifts to DATE-only values.

---

# 32. File Naming

Laravel:

```text
PascalCase.php
```

React:

Use repository convention consistently.

Do not mix naming styles inside the same module.

---

# 33. TypeScript Rules

Avoid `any` unless unavoidable.

Create shared types:

```text
Package
Jamaah
PackageRegistration
JamaahDocument
DocumentType
PaginatedResponse<T>
```

Prefer typed page props.

---

# 34. Form State

Use a single consistent pattern aligned with the existing stack.

When using Inertia:

```text
useForm()
```

is preferred unless repository standard uses another form library.

Always:

- show validation error
- preserve useful inputs after validation failure
- prevent duplicate submission
- show completion/success feedback

---

# 35. Search

Search fields should be debounced.

Backend must trim search values.

Never construct SQL using concatenated raw user input.

Use query builder bindings.

---

# 36. Filters

Filters should be explicit and composable.

Recommended query object:

```text
search
package_id
package_status
registration_status
document_status
departure_from
departure_to
registration_from
registration_to
sort
direction
page
per_page
```

---

# 37. Pagination

Do not retrieve all jamaah by default.

Default:

```text
per_page = 25
```

Allowed:

```text
10
25
50
100
```

Server must enforce maximum.

---

# 38. Export

Large export should be queue-ready.

Do not block a normal HTTP request for very large reports if the implementation already supports queue processing.

Export data must respect permission and filters.

---

# 39. Migrations

Every schema change must use migrations.

Never edit production data structures manually as part of implementation instructions.

Foreign keys must use appropriate cascade/restrict behavior.

Do not cascade-delete jamaah history accidentally.

---

# 40. Seeder

Provide seeders for:

- default roles
- permissions
- common facilities
- common document types

Seeders must be idempotent where practical.

---

# 41. Documentation

When implementing a feature:

Update relevant documentation when:

- new permission added
- new status added
- new business rule added
- database relation changed
- configuration changed

---

# 42. Agent Workflow

Before coding:

1. Read relevant requirements.
2. Inspect existing code.
3. Identify impacted models/routes/pages/tests.
4. Preserve existing patterns where valid.
5. Determine transaction boundary.

During coding:

1. Implement schema/domain.
2. Implement validation.
3. Implement authorization.
4. Implement action/service.
5. Implement controller.
6. Implement UI.
7. Add tests.
8. Run lint/tests.

After coding:

1. Review for N+1.
2. Review for permission bypass.
3. Review for race condition.
4. Review responsive UI.
5. Review validation.
6. Review test coverage.

---

# 43. Never Do

An AI agent MUST NOT:

- Remove data silently.
- Disable validation to make tests pass.
- Bypass authorization.
- Store private documents publicly.
- Overbook package seats.
- Hardcode every facility.
- Hardcode each document as a jamaah table column.
- Put critical seat logic only in frontend.
- Introduce a new major dependency without justification.
- Rewrite unrelated modules.
- Change unrelated formatting across the repository.
- Expose PII in logs.

---

# 44. Completion Checklist

Before declaring a task complete:

- [ ] Requirement implemented.
- [ ] Authorization checked.
- [ ] Backend validation added.
- [ ] Transactions used where required.
- [ ] No obvious N+1.
- [ ] Responsive UI checked.
- [ ] Loading state handled.
- [ ] Empty state handled.
- [ ] Error state handled.
- [ ] Tests added/updated.
- [ ] Tests pass.
- [ ] Lint/typecheck pass where available.
- [ ] Documentation updated.
