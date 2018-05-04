using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace jisuanqi
{
    public abstract class  count
    {

        public int Right { get; set; }
        public  int Left { get;set; }

      

        public abstract int Calc();
    }
}
