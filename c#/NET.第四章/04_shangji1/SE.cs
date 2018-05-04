using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _04_shangji1
{
    class SE
    {
         public string Id { get; set; }
         public string Name { get; set; }
         public int Age{ get; set; }
         public string Sex { get; set; }
         public int Wh { get; set; }
        public SE (string id,string name,int age,string sex,int wh)
        {
            this.Id = id;
            this.Name = name;
            this.Age = age;
            this.Sex = sex;
            this.Wh = wh;
        }
      
        
    }
}
