use warnings;
use strict;

use Spreadsheet::ParseExcel::Stream::XLSX;

use lib 'lib';
use Util;

=pod
use this script as follows:
$ perl xlsx2json.pl [xls_file_path]
=cut

my $xlsx_file = $ARGV[0] || '/data/sample.xlsx';
my $path = "public/master_data.json";
Util::write_file($path, Util::json_encode(parse_xlsx($xlsx_file)));

sub parse_xlsx {
    my ($file_path) = @_;
    my $XLSX = Spreadsheet::ParseExcel::Stream::XLSX->new($file_path);
    my $book = {};

    OUTER:
    while ( my $sheet = $XLSX->sheet() ) {
        my $name = $sheet->name();
        print ">>>>> processing sheet $name <<<<<\n";
        $sheet->row;#这一行是中文名，舍弃不用，从第二行开始为有效数据

        my $col_names = [ grep { ($_) = /\w+/g; $_ } @{ $sheet->row } ];

        INNER:
        while ( my $row = $sheet->row ) {
            next INNER unless grep { $_ } @$row;
            my $record = {
                map { $col_names->[$_] => $row->[$_] } (0 .. @$col_names - 1)
            };
            push @{ $book->{$name} }, $record;
        }
        print ">>>>> finished sheet: $name <<<<<\n\n";
    }
    return $book;
}
