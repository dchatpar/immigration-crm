
### ✅ Verification Steps

To verify the installation and setup:

1.  **Database Connection:**
    Run the health check endpoint:
    ```bash
    curl -X POST http://localhost:3000/api/health
    ```
    Expected response: `{"database":"connected", ...}`

2.  **Seed Data:**
    Verify seed data exists:
    ```bash
    npx prisma db seed
    ```

3.  **Customer Portal:**
    Generate a token for a case (get a case ID from database first):
    ```bash
    curl -X POST http://localhost:3000/api/portal/generate-token \
      -H "Content-Type: application/json" \
      -d '{"caseId": "your-case-id"}'
    ```

4.  **Background Jobs:**
    Trigger reminder processing manually:
    ```bash
    curl http://localhost:3000/api/cron?job=reminders -H "Authorization: Bearer <CRON_SECRET>"
    ```

5.  **Admin Settings:**
    Navigate to `/dashboard/settings` and ensure you can view and save settings.
