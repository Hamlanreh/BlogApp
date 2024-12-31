
namespace BlogApp.Server.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string Author { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string? FeaturedImage { get; set; }
        public int? Views { get; set; } = 0; // Initialize to 0
        public DateTime? PublishedOn { get; set; } = DateTime.Now;

        public int CategoryId { get; set; }
        public Category? Category { get; set; }
        public List<Comment>? Comments { get; set; } = new List<Comment>();
        
    }
}
