using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace three
{
   public  class Move
    {
       public string Fang2 { get; set; }
       public string Jv { get; set; }
       public string Lou { get; set; }
       public string Fang { get; set; }

       public Move()
       {
           
       }
       public Move(string fang2,string jv,string lou,string  fang)
       {
           this.Fang = fang;
           this.Fang2 = fang2;
           this.Lou = lou;
           this.Jv = jv;
       }

    }
}
