using Microsoft.EntityFrameworkCore;

public static class Api
{
    public static void ApiEndPoints(this WebApplication app)
    {
        app.MapGet("/", () =>
            new
            {
                api = "Job Tracker",
                version = "1.0",
                endpoints = new[] { "/jobs" }
            });

        // GET (med filter)
        app.MapGet("/jobs", async (JobStatus? status, AppDbContext db) =>
        {
            var query = db.Jobs.AsQueryable();

            if (status != null)
            {
                query = query.Where(j => j.Status == status);
            }

            return await query.ToListAsync();
        });

        // POST
        app.MapPost("/jobs", async (JobApplication job, AppDbContext db) =>
        {
            if (string.IsNullOrWhiteSpace(job.Company))
                return Results.BadRequest("Company is required");

            db.Jobs.Add(job);
            await db.SaveChangesAsync();

            return Results.Ok(job);
        });

        // UPDATE
        app.MapPut("/jobs/{id}", async (int id, JobApplication updatedJob, AppDbContext db) =>
        {
            var job = await db.Jobs.FindAsync(id);
            if (job == null) return Results.NotFound();

            job.Company = updatedJob.Company;
            job.Position = updatedJob.Position;
            job.Status = updatedJob.Status;

            await db.SaveChangesAsync();
            return Results.Ok(job);
        });

        // DELETE
        app.MapDelete("/jobs/{id}", async (int id, AppDbContext db) =>
        {
            var job = await db.Jobs.FindAsync(id);
            if (job == null) return Results.NotFound();

            db.Jobs.Remove(job);
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        // Analytics
        app.MapGet("/jobs/analytics", async (AppDbContext db) =>
        {
            var grouped = await db.Jobs
                .GroupBy(j => j.Status)
                .Select(g => new
                {
                    status = g.Key,
                    count = g.Count()
                })
                .ToListAsync();    

            return Results.Ok(grouped);
        }); 


    }
}