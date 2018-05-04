using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace book
{ 
      public class book
    {
          /// <summary>
          /// Id
          /// </summary>
        private int id;
        public int Id
        {
            get { return id; }
            set { id = value; }
        }
          /// <summary>
          /// Name
          /// </summary>
        private string name;
        public string Name
        {
            get { return name; }
            set { name = value; }
        }
          /// <summary>
          /// Author
          /// </summary>
        private string author;
        public string Author
        {
            get { return author; }
            set { author = value; }
        }
          /// <summary>
          ///  Time
          /// </summary>
        private DateTime time;
        public DateTime Time
        {
            get { return time; }
            set { time = value; }
        }
          /// <summary>
          /// Type
          /// </summary>
        private string type;
        public string Type
        {
            get { return type; }
            set { type = value; }
        }
         
    }
}
