using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Text.Json.Serialization;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.AddSingleton<IConfiguration>(builder.Configuration);
Console.WriteLine($"DB Connection: {configuration.GetConnectionString("DefaultConnection")}");
builder.Services.AddDbContext<CarDBContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));
builder.Services.AddScoped<CarServices>();

var cors = configuration.GetValue<string>("corsURI");
Console.WriteLine($"CORS URI: {cors}");
if(cors != null)
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowSpecificOrigin",
            builder =>
            {
                builder.WithOrigins(cors) // Replace with your frontend domain
                       .AllowAnyHeader()
                       .SetIsOriginAllowedToAllowWildcardSubdomains()
                       .AllowAnyMethod();
            });
    });
}
builder.Services.AddMvc().AddJsonOptions(options => {
    // open api is currently using system.text.json
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault;
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
});
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies()); // Reflection for AutoMapper Profiles;

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

Configure(app);
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.MapControllers();
app.Run();

void Configure(IApplicationBuilder app)
{
    app.UseHttpsRedirection();
    app.UseAuthorization();
    app.UseCors("AllowSpecificOrigin");
    // app.UseStaticFiles();
    app.UseRouting();
    // app.UseAuthentication();
    // app.UseAuthorization();
    //app.UseEndpoints(endpoints =>
    //{
    //    endpoints.MapControllers();
    //});
}