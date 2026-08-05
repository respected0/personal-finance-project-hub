# Integration — Personal Finance OS

This directory tracks cross-repository integration milestones and validated version combinations.

---

## Purpose

As the Personal Finance OS evolves across multiple private repositories, integration validation
ensures that a specific combination of backend, web, and mobile versions work correctly together.

---

## How Integration Versioning Works

1. A milestone version is proposed by pinning specific commit SHAs from each private repository
2. Integration tests are run against that combination
3. If all tests pass, the combination is recorded as a validated version in `versions/current.yaml`
4. The Hub is updated with the validated version pins

---

## Versioning Cadence

- Integration validation is performed before each release candidate (RC)
- Hotfixes may produce point releases with targeted integration validation
- No version is published here without passing the integration validation gate

---

## Status

**Initial split phase** — No validated integrations yet.

The repositories have been initialized from the PRE-RC monorepo baseline.
Integration testing will begin after each private repository completes its initial setup.

---

## Validated Versions

None yet. See `versions/current.yaml` for current state.
