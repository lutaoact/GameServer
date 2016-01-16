use warnings;
use strict;

=pod
$ perl script/make_model.pl [model_name]
$ perl script/make_model.pl UserCard
=cut

use lib 'lib';
use CodeTemplate;
use Util qw/write_file/;

my $model = $ARGV[0] || die 'model name can not be empty';

touch_model_file($model);
touch_test_file($model);

sub touch_model_file {
    my ($model) = @_;
    my $model_path = 'app/model';
    my $model_tmpl = CodeTemplate::TMPL->{model};
    write_file(
        "$model_path/$model.js",
        sprintf $model_tmpl, $model, $model
    );
}

sub touch_test_file {
    my ($model) = @_;
    my $test_path = 'test/model';
    my $test_tmpl = CodeTemplate::TMPL->{test};
    write_file(
        "$test_path/test$model.js",
        sprintf $test_tmpl, map { $model } 1 .. 7
    );
}
