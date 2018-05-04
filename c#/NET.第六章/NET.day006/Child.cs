using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NET.day006
{
   public  class Child:Parent
    {
       public Child() { }


       public Child(string name,int score,string homeaddress):base(name,score) {
           this.Homeaddress = homeaddress;
       
       
       
       }
       public string  Homeaddress { get; set; }


    }
}
