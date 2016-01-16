package Util;
use warnings;
use strict;

use JSON;

BEGIN {
    use Exporter();
    our @ISA = qw(Exporter);
    our @EXPORT_OK = qw(
        json_decode
        json_encode
        write_file
        convert_to_camel_case
        convert_to_snake_case
    );
}

sub json_decode {
    my ($json_text) = @_;
    my $JSON = JSON->new->allow_nonref;
    return $JSON->decode($json_text);
}

sub json_encode {
    my ($json_obj) = @_;
    my $JSON = JSON->new->allow_nonref;
    return $JSON->pretty->encode($json_obj);
}

sub write_file {
    my ($file, $text) = @_;
    open my $fh, '>', $file or die "$!";
    print $fh $text;
    close $fh;
}

sub convert_to_camel_case {
    my ($str) = @_;
    return join '', map { ucfirst $_ } split /_/, $str;
}

sub convert_to_snake_case {
    my ($str) = @_;
    return join '_', map { lcfirst $_} $str =~ /[A-Z][a-z0-9]+/g;
}

1;
