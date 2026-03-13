import { internalAction } from "./_generated/server";
import { internal, api } from "./_generated/api";

export const simulate = internalAction({
    args: {},
    handler: async (ctx) => {
        console.log("Starting Workflow Simulation...");

        // 1. Get the case seeded
        const cases = await ctx.runQuery(internal.cases.listInternal);
        const testCase = cases.find(c => c.caseNumber === "CASE-2024-001");

        if (!testCase) {
            console.error("Test case not found. Did you run 'npx convex run seed:seed'?");
            return;
        }

        console.log(`Using test case: ${testCase.caseNumber} (${testCase._id})`);

        // 2. Loop through steps
        let steps = 0;
        let isComplete = false;

        // Safety break to prevent infinite loops
        const MAX_STEPS = 25;

        while (!isComplete && steps < MAX_STEPS) {
            steps++;
            console.log(`Step ${steps}: Advancing workflow...`);

            try {
                // We need to call a mutation. Since internalAction can't call mutation directly efficiently without scheduling,
                // we should arguably have used an internalMutation for simulation, but actions are better for long running logs.
                // However, internalAction via `runMutation` is the way.
                const result = await ctx.runMutation(api.workflows.advanceStep, { caseId: testCase._id });

                if (result.completed) {
                    console.log("✅ Workflow Completed!");
                    isComplete = true;
                } else {
                    console.log(`   -> Moved to: ${result.nextStep}`);
                }
            } catch (error: any) {
                console.error(`❌ Error advancing step: ${error.message}`);
                break;
            }
        }

        if (steps >= MAX_STEPS && !isComplete) {
            console.warn("⚠️ Reached max steps without completion.");
        }

        // Verify final status
        const finalCase = await ctx.runQuery(api.cases.get, { id: testCase._id });
        if (finalCase) {
            console.log(`Final Case Status: ${finalCase.status}`);
            console.log(`Final Current Step: ${finalCase.currentStep}`);
        }

    },
});
