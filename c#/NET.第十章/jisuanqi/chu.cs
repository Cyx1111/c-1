using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace jisuanqi
{
    public  class chu:count
   {
       public int shang;
       public override int Calc()
       {
           shang = this.Left + this.Right;
           return shang;
       }
    }
        

}
